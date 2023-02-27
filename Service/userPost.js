import { request, requestWithRetry } from '../Helper/httpHelper.js'
import { getQueryParamByUrl } from '../Helper/urlHelper.js'
import { log, logLevel } from '../Helper/logHelper.js'
const { errorLevel } = logLevel
import { saveFile } from '../Helper/fsHelper.js'
import { retryCount, delayTimeOut, checkDownloadCount } from '../Config/config.js'
import { calcSecondDifference, delay } from '../Helper/dateHelper.js'
import { getXg } from './xg.js'
import { dataPath } from '../Config/config.js'
import {
  aweme,
  video as videoType,
  picture,
  awemeDetail,
  awemeAvatar,
  downloadTypeOfAll,
  downloadTypeOfUpdate
} from './const.js'
import { addAweme } from './aweme.js'

const createApi = async (type, param) => {
  await delay(delayTimeOut, '正在创建url，涉及xg参数')
  let api = "";
  let paramText = "";
  let xg = ""
  switch (type) {
    case aweme: //作品集
      const { secUserId, onePageCount, cursor } = param
      paramText = `aid=1128&version_name=23.5.0&device_platform=android&os_version=2333&sec_user_id=${secUserId}&count=${onePageCount}&max_cursor=${cursor}`
      xg = await getXg(paramText)
      api = `https://www.douyin.com/aweme/v1/web/aweme/post/?${paramText}`
      api = `${api}&X-Bogus=${xg}`
      break;
    case videoType: //视频
      const { videoUri } = param
      api = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${videoUri}&ratio=1080p&line=0`
      break;
    case awemeDetail://作品详情
      const { aweme_id } = param
      paramText = `aid=1128&version_name=23.5.0&device_platform=android&os_version=2333&aweme_id=${aweme_id}`
      xg = await getXg(paramText)
      api = `https://www.douyin.com/aweme/v1/web/aweme/detail/?${paramText}`
      api = `${api}&X-Bogus=${xg}`
      break;
    case awemeAvatar://作者头像
      const { fileUri } = param
      api = `https://p3-pc.douyinpic.com/img/aweme-avatar/${fileUri}~c5.jpeg?from=2956013662`
      break;
  }

  return {
    xg,
    api
  };
}

const getSecUserIdFromShortUrl = async (userHomeShortUrl) => {
  return await request.get(userHomeShortUrl)
    .then((res) => {
      // log(res.request.res.responseUrl);
      return getQueryParamByUrl(res.request.res.responseUrl, "sec_uid")
    });
}

// aweme_list       时当前获取的作品列表
//    aweme_type    是作品类型 68：图集 0：视频
//    aweme_id      作评id
//    video 
//      play_addr
//        uri       视频资源id
//    desc          内容
//    create_time   发布时间
//    is_top        是否置顶
// max_cursor     
// 
const downloadUserPost = async (secUserId, cursor = 0, currentRetryCount = 0, status, downloadType = downloadTypeOfAll) => {
  const downloadStatus = status ? status : {
    photoCount: 0,
    videoCount: 0,
    beginTime: Date.now(),
    endTime: undefined,
    downloadTimeCost: 0,
    photoFailCount: 0,
    videoFailCount: 0
  }

  let downloadedCount = 1

  const { api, xg } = await createApi(aweme, { secUserId, onePageCount: 35, cursor })

  if (!xg) {
    log('未获取到xg参数，将跳过当前用户~');
    return downloadStatus
  }

  const postListResRaw = await request.get(api)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      log(err);
    })

  let { aweme_list = [], max_cursor = 0 } = postListResRaw || {}

  if (!aweme_list) {
    aweme_list = []//防止报错
  }
  // log(JSON.stringify(aweme_list))

  const awemeCount = aweme_list.length
  log(`${cursor}页，获取到${awemeCount}个作品`);

  for (let index = 0; index < awemeCount; index++) {
    //增量更新模式，当已下载数量超过配置的数量时，将跳过
    if (downloadType == downloadTypeOfUpdate && downloadedCount > checkDownloadCount) {
      log(`当前用户最新的${checkDownloadCount}个作品都已下载(跳过置顶)，将跳过该用户~`);
      break
    }

    let awemeItem = aweme_list[index]

    const { aweme_type, aweme_id, video = {}, desc = "", create_time = "", is_top = 0 } = awemeItem

    const path = dataPath + secUserId  //以user_sec_id为文件夹名
    let downloadRes = []
    let awemeType = ""

    await delay(delayTimeOut)

    if (is_top) {
      log(`${cursor}页，第${index + 1}个作品是置顶的~`);
    }

    switch ((aweme_type + "")) {
      case "68":
        log(`${cursor}页，第${index + 1}个作品是图集，正在处理。`);
        awemeType = picture
        downloadRes = await downloadPicture(secUserId, aweme_id, path)
        break;
      // case "0":
      //   log(`${cursor}页，第${index + 1}个作品是视频，正在处理。`);
      //   awemeType = videoType
      //   downloadRes = await downloadVideo(secUserId, aweme_id, video.play_addr.uri, path);
      default:
        //除了68，其他统一先按视频下载
        log(`${cursor}页，第${index + 1}个作品是的类型是${aweme_type},统一按视频处理~`);
        awemeType = videoType
        if (video && video.play_addr) {
          downloadRes = await downloadVideo(secUserId, aweme_id, video.play_addr.uri, path);
        }
        else {
          log(`该作品格式异常${JSON.stringify(awemeItem)}`, errorLevel)
        }
        break;
    }

    //保存作品信息
    // log(downloadRes);
    for (let j = 0; j < downloadRes.length; j++) {
      let { fileUrl, msg, downloadSuccessFlag, existFlag } = downloadRes[j]

      switch (awemeType) {
        case videoType:
          log(`视频${msg}`);
          if (downloadSuccessFlag) {
            downloadStatus.videoCount++
          }

          if (existFlag && is_top == 0) { //置顶不算
            downloadedCount++
          }
          break;
        case picture:
          if (j == 0) {
            log(`作品${aweme_id}总共有${downloadRes.length}张图`);
            if (existFlag && is_top == 0) { //置顶不算
              downloadedCount++
            }
          }
          log(`第${j + 1}张图片，${msg}`);

          if (downloadSuccessFlag) {
            downloadStatus.photoCount++
          }
          break;
      }

      if ((!downloadSuccessFlag) && (!existFlag)) {
        log(`用户:${secUserId},异常记录:${JSON.stringify(downloadRes[j])} `, errorLevel)
        switch (awemeType) {
          case videoType:
            downloadStatus.videoFailCount++
            break;
          case picture:
            downloadStatus.photoFailCount++
            break;
        }
      }

      await addAweme({
        secUserId,
        awemeId: aweme_id,
        awemeType,
        desc,
        awemeFileUrl: fileUrl,
        createTime: create_time
      })
    }
    log(`作品${aweme_id} 处理完毕！`);
  }

  if (awemeCount.length == 0 || max_cursor == 0) {
    //api不是很稳定，有几率没有成功，所以会多尝试几次
    let count = currentRetryCount + 1
    if (currentRetryCount < retryCount) {
      await delay(delayTimeOut, `正在进行第${count} 次重新获取`)
      return await downloadUserPost(secUserId, cursor, count, downloadStatus, downloadType);
    }
    else {
      log(`无数据，彻底跳出~`);
    }
  }
  else {
    //全量更新，才需要翻页，增量更新，第一页检查一下有没有漏，不会再查询第二页。
    if (downloadType == downloadTypeOfAll) {
      //递归翻页，当返回的max_cursor为0时，返回首页，递归结束
      await delay(delayTimeOut)
      return await downloadUserPost(secUserId, max_cursor, undefined, downloadStatus, downloadType);
    }
  }


  downloadStatus.endTime = Date.now()
  downloadStatus.downloadTimeCost = calcSecondDifference(downloadStatus.beginTime, downloadStatus.endTime)
  return downloadStatus
}

const getUserInfo = async (secUserId) => {
  const { api } = await createApi(aweme, { secUserId, onePageCount: 1, cursor: 0 })
  log(`正在获取用户信息~`)
  const postListResRaw = await requestWithRetry(() => {
    return request.get(api)
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        log(err);
      })
  }, (requestRes) => {
    //log(requestRes);
    const { aweme_list = [], max_cursor = 0 } = requestRes

    if (!aweme_list) {
      return false
    }

    if (aweme_list.length == 0 || max_cursor == 0) {
      return false
    }
    else {
      return true
    }
  })

  const { aweme_list = [] } = postListResRaw
  let nickName = "";
  const picPath = dataPath + secUserId  //以user_sec_id为文件夹名
  let picPathFull = ""

  if (aweme_list && aweme_list.length > 0) {
    nickName = aweme_list[0].author.nickname
    log(`获取到用户昵称：${nickName}`);

    const fileUri = aweme_list[0].author.avatar_thumb.uri.replaceAll('100x100/aweme-avatar/', '')
    const fileName = fileUri + ".jpeg"
    picPathFull = picPath + "/" + fileName
    log(`正在保存用户头像`)
    const { api } = await createApi(awemeAvatar, { fileUri });
    await saveFile(api, picPath, fileName);
  }
  else {
    log('获取用户名称和头像失败~', errorLevel)
  }

  return {
    secUserId,
    nickName,
    picPath,
    picPathFull
  }
}

// aweme_detail   
//    images                  一个作品里图片有很多张
//        download_url_list   有水印，
//        url_list            无水印，目前选第四个，应该都是一样的，随便选一个。
//        uri                 tos-cn-i-0813/14cbc5ee63ce4bbe84f419ba14625505 可以当作图片的id
//    author
//        sec_uid             用户id
//    desc                    作品内容
const downloadPicture = async (secUserId, aweme_id, path) => {
  const { api } = await createApi(awemeDetail, { aweme_id })

  // log(api);

  const resList = []

  const pictureResRaw = await requestWithRetry(() => {
    return request.get(api)
      .then((res) => {
        // log(JSON.stringify(res.data));
        return res.data
      })
      .catch((err) => {
        log(err);
      })
  }, (requestRes) => {
    if (!requestRes.aweme_detail) {
      return false
    }
    return true
  })

  let { images } = (pictureResRaw.aweme_detail) || {}

  if (!images) {
    images = []
  }

  for (let index = 0; index < images.length; index++) {
    const { url_list, uri = "" } = images[index]
    const fileName = aweme_id + "-" + uri.replaceAll('/', '-') + '.jpeg' //作品id+图片id
    const res = await saveFile(url_list[3], path, fileName);
    resList.push({
      ...res,
      aweme_id
    });
  }
  return resList
}


const downloadVideo = async (secUserId, aweme_id, videoUri, path) => {
  const { api } = await createApi(videoType, { videoUri });
  const fileName = aweme_id + "-" + videoUri.replaceAll('/', '-') + ".mp4"
  const res = await saveFile(api, path, fileName)
  return [{
    ...res,
    aweme_id
  }];
}

export {
  getSecUserIdFromShortUrl,
  downloadUserPost,
  getUserInfo
}