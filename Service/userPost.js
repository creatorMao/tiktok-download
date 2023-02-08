import { request } from '../Helper/httpHelper.js'
import { getQueryParamByUrl } from '../Helper/urlHelper.js'
import { log } from '../Helper/logHelper.js'
import { saveFile } from '../Helper/fsHelper.js'
import { retryCount } from '../Config/config.js'
import { calcSecondDifference } from '../Helper/dateHelper.js'
import { getXg } from './xg.js'
import { dataPath } from '../Config/config.js'

const aweme = "aweme"
const video = "video"
const awemeDetail = "aweme-detail"
const awemeAvatar = "aweme-avatar"
const createApi = (type, param) => {
  let api = "";
  let paramText = "";
  switch (type) {
    case aweme: //作品集
      const { secUserId, onePageCount, cursor } = param
      paramText = `aid=6383&sec_user_id=${secUserId}&count=${onePageCount}&max_cursor=${cursor}`
      api = `https://www.douyin.com/aweme/v1/web/aweme/post/?${paramText}`
      break;
    case video: //视频
      const { videoUri } = param
      api = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${videoUri}&ratio=1080p&line=0`
      break;
    case awemeDetail://作品详情
      const { aweme_id } = param
      paramText = `aid=6383&aweme_id=${aweme_id}`
      api = `https://www.iesdouyin.com/aweme/v1/web/aweme/detail/?${paramText}`
      break;
    case awemeAvatar://作者头像
      const { fileUri } = param
      api = `https://p3-pc.douyinpic.com/img/aweme-avatar/${fileUri}~c5.jpeg?from=2956013662`
      break;
  }

  //加密参数
  api = `${api}&X-Bogus=${getXg(paramText)}`

  return api;
}

const getSecUserIdFromShortUrl = async (userHomeShortUrl) => {
  return await request.get(userHomeShortUrl)
    .then((res) => {
      // console.log(res.request.res.responseUrl);
      return getQueryParamByUrl(res.request.res.responseUrl, "sec_uid")
    });
}

// aweme_list       时当前获取的作品列表
//    aweme_type    是作品类型 68：图集 0：视频
//    aweme_id      作评id
//    video 
//      play_addr
//        uri       视频资源id
// max_cursor     
// 
const downloadUserPost = async (secUserId, cursor = 0, currentRetryCount = 0, status) => {
  const downloadStatus = status ? status : {
    photoCount: 0,
    videoCount: 0,
    beginTime: Date.now(),
    endTime: undefined,
    downloadTimeCost: 0
  }

  const api = createApi(aweme, { secUserId, onePageCount: 30, cursor })
  const postListResRaw = await request.get(api)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err);
    })

  const { aweme_list = [], max_cursor = 0 } = postListResRaw || {}
  const awemeCount = aweme_list.length
  log(`${cursor}页，获取到${awemeCount}个作品`);

  for (let index = 0; index < awemeCount; index++) {
    const { aweme_type, aweme_id, video = {} } = aweme_list[index]
    const path = dataPath + secUserId  //以user_sec_id为文件夹名
    switch ((aweme_type + "")) {
      case "68":
        log(`${cursor}页，第${index}个作品是图集，正在处理。`);
        await downloadPicture(secUserId, aweme_id, path, downloadStatus)
        break;
      case "0":
        log(`${cursor}页，第${index}个作品是视频，正在处理。`);
        await downloadVideo(secUserId, aweme_id, video.play_addr.uri, path);
        downloadStatus.videoCount++
        break;
    }
  }

  if (awemeCount.length == 0 || max_cursor == 0) {
    //api不是很稳定，有几率没有成功，所以会多尝试几次
    let count = currentRetryCount + 1
    if (currentRetryCount < retryCount) {
      log(`正在进行第${count}次获取`);
      await downloadUserPost(secUserId, cursor, count, downloadStatus);
    }
    else {
      log(`无数据，彻底跳出~`);
    }
  }
  else {
    //递归翻页，当返回的max_cursor为0时，返回首页，递归结束
    await downloadUserPost(secUserId, max_cursor, undefined, downloadStatus);
  }


  downloadStatus.endTime = Date.now()
  downloadStatus.downloadTimeCost = calcSecondDifference(downloadStatus.beginTime, downloadStatus.endTime)
  return downloadStatus
}

const getUserInfo = async (secUserId) => {
  const api = createApi(aweme, { secUserId, onePageCount: 1, cursor: 0 })
  const postListResRaw = await request.get(api)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err);
    })

  const { aweme_list = [] } = postListResRaw || {}
  let nickName = "";
  const picPath = dataPath + secUserId  //以user_sec_id为文件夹名
  let picPathFull = ""

  if (aweme_list.length > 0) {
    nickName = aweme_list[0].author.nickname
    const fileUri = aweme_list[0].author.avatar_thumb.uri.replaceAll('100x100/aweme-avatar/', '')
    const fileName = fileUri + ".jpeg"
    picPathFull = picPath + "/" + fileName
    const api = createApi(awemeAvatar, { fileUri });
    await saveFile(api, picPath, fileName);
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
const downloadPicture = async (secUserId, aweme_id, path, downloadStatus) => {
  const api = createApi(awemeDetail, { aweme_id })

  // log(api);

  const pictureResRaw = await request.get(api)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err);
    })
  const { images } = pictureResRaw.aweme_detail

  log(`作品${aweme_id}总共有${images.length}张图`);

  for (let index = 0; index < images.length; index++) {
    const { url_list, uri = "" } = images[index]
    const fileName = aweme_id + "-" + uri.replaceAll('/', '-') + '.jpeg' //作品id+图片id
    await saveFile(url_list[3], path, fileName);
    downloadStatus.photoCount++
  }
  log(`作品${aweme_id}下载完毕！`);
}


const downloadVideo = async (secUserId, aweme_id, videoUri, path) => {
  const api = createApi(video, { videoUri });
  const fileName = aweme_id + "-" + videoUri.replaceAll('/', '-') + ".mp4"
  await saveFile(api, path, fileName);
}

export {
  getSecUserIdFromShortUrl,
  downloadUserPost,
  getUserInfo
}