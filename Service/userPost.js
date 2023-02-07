import axios from 'axios'
import { getQueryParamByUrl } from '../Helper/urlHelper.js'
import { log } from '../Helper/logHelper.js'
import { saveFile } from '../Helper/fsHelper.js'
import { retryCount } from '../config.js'
import { calcSecondDifference } from '../Helper/dateHelper.js'

const downloadPathPrefix = './Download/'

const getSecUserIdFromShortUrl = async (userHomeShortUrl) => {
  return await axios.get(userHomeShortUrl)
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
  const onePageCount = 35; //一页数量

  const downloadStatus = status ? status : {
    photoCount: 0,
    videoCount: 0,
    beginTime: Date.now(),
    endTime: undefined,
    downloadTimeCost: 0
  }

  const postVideosApi = `https://www.iesdouyin.com/aweme/v1/web/aweme/post/?sec_user_id=${secUserId}&count=${onePageCount}&max_cursor=${cursor}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`

  const postListResRaw = await axios.get(postVideosApi)
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
    const path = downloadPathPrefix + secUserId  //以user_sec_id为文件夹名
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
  const onePageCount = 1; //一页数量
  const cursor = 0;

  const postVideosApi = `https://www.iesdouyin.com/aweme/v1/web/aweme/post/?sec_user_id=${secUserId}&count=${onePageCount}&max_cursor=${cursor}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`

  const postListResRaw = await axios.get(postVideosApi)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err);
    })

  const { aweme_list = [] } = postListResRaw || {}
  const nickName = "";
  const picPath = downloadPathPrefix + secUserId  //以user_sec_id为文件夹名
  const picPathFull = ""

  if (aweme_list.length > 0) {
    nickName = aweme_list[0].author.nickName
    const fileUri = aweme_list[0].author.avatar_thumb.uri.replaceAll('100x100/aweme-avatar/', '')
    const fileName = fileUri + "~c5.jpeg"
    picPathFull = picPath + "/" + fileName
    const userpic = `https://p3-pc.douyinpic.com/img/aweme-avatar/${fileName}?from=2956013662`

    await saveFile(url_list[3], picPath, fileName);
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
  const api = `https://www.iesdouyin.com/aweme/v1/web/aweme/detail/?aweme_id=${aweme_id}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`

  // log(api);

  const pictureResRaw = await axios.get(api)
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
  const api = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${videoUri}&ratio=1080p&line=0`
  const fileName = aweme_id + "-" + videoUri.replaceAll('/', '-') + ".mp4"
  await saveFile(api, path, fileName);
}

export {
  getSecUserIdFromShortUrl,
  downloadUserPost,
  getUserInfo
}