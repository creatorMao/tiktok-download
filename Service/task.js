import { initDb } from '../Helper/dbHelper.js'
import { createTableSqlList } from '../Config/createTable.js'
import { getUserList } from './user.js'
import { getSecUserIdFromShortUrl, downloadUserPost } from './userPost.js'
import { dbFilePath, newsCenter, downloadType } from '../Config/config.js'
import { log, restartLog } from '../Helper/logHelper.js'
import { request } from '../Helper/httpHelper.js'
import { getNowDate } from '../Helper/dateHelper.js'
import { getUserAwemeList } from '../Service/aweme.js'
import { downloadTypeOfAll } from '../Service/const.js'

const startTask = async () => {
  restartLog()
  await initDb(dbFilePath, createTableSqlList);

  const userList = await getUserList();
  const total = userList.length

  const taskStatus = {
    PHOTO_COUNT: 0,
    VIDEO_COUNT: 0,
    DOWNLOAD_TIME_COST: 0,
    IMP_TIME: '',
    TOTAL: total,
    CURRENT: 0,
    PROGRESS: 0
  }

  log(`本次增量更新，预计将更新${total}个用户~`);
  for (let index = 0; index < total; index++) {
    const nickName = userList[index]["NICK_NAME"]
    log(`正在更新第${index + 1}个用户,用户名:【${nickName}】`)
    const user = userList[index]

    if (user.DOWNLOAD_FLAG == '0') {
      log(`该用户设置了不更新，将跳过~`)
      continue
    }

    let secUserId = user['SEC_USER_ID']
    const awemeList = await getUserAwemeList(secUserId);

    let dlType = downloadType
    if (awemeList.length == 0) {
      dlType = downloadTypeOfAll //表里没有数据，直接全量
    }

    const status = await downloadUserPost(secUserId, undefined, undefined, undefined, dlType);
    log(`第${index + 1}个用户更新完毕~下载了${status.videoCount}个视频,${status.photoCount}张图片，耗时${status.downloadTimeCost}秒~`)
    taskStatus.PHOTO_COUNT += status.photoCount
    taskStatus.VIDEO_COUNT += status.videoCount
    taskStatus.DOWNLOAD_TIME_COST += status.downloadTimeCost
    taskStatus.IMP_TIME = getNowDate();
    taskStatus.CURRENT = (index + 1)
    taskStatus.PROGRESS = ((index + 1) / total).toFixed(2)
    await sendTaskStatus({ ...taskStatus });
  }

  log(`本次增量更新更新完毕，下载了${taskStatus.VIDEO_COUNT}个视频,${taskStatus.PHOTO_COUNT}张图片，耗时${taskStatus.DOWNLOAD_TIME_COST}秒~`);
}


const sendTaskStatus = async (taskStatus) => {
  const { groupId, url } = newsCenter
  if (url) {
    request({
      method: 'post',
      url,
      params: {
        groupId,
        content: JSON.stringify(taskStatus)
      }
    }).then((res) => {
      log('下载状态发送成功！');
    }).catch(res => {
      log('下载状态发送失败');
    }).finally(() => {
    });
  }
  else {
    log('未配置信息中心，下载状态暂时不发送！');
  }
}

export {
  startTask
}