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
import { createGuid } from '../Helper/generatorHelper.js'
import { getLatestTaskStatus, addTaskStatus } from './taskStatus.js'

const startTask = async (restartLogFlag = false) => {
  if (restartLogFlag) {
    restartLog()
  }
  await initDb(dbFilePath, createTableSqlList);

  const userList = await getUserList().filter((item) => {
    return (item.DOWNLOAD_FLAG == '1')
  });
  const total = userList.length

  const taskStatus = {
    TASK_ID: createGuid(),
    PHOTO_COUNT: 0,
    VIDEO_COUNT: 0,
    DOWNLOAD_TIME_COST: 0,
    TOTAL: total,
    CURRENT: 0,
    PROGRESS: 0,
    PHOTO_FAIL_COUNT: 0,
    VIDEO_FAIL_COUNT: 0,
    FAIL_TOTAL: 0
  }

  log(`本次增量更新，预计将更新${total}个用户~`);
  for (let index = 0; index < total; index++) {
    const nickName = userList[index]["NICK_NAME"]
    log(`正在更新第${index + 1}个用户,用户名:【${nickName}】`)
    const user = userList[index]

    let secUserId = user['SEC_USER_ID']
    const awemeList = await getUserAwemeList(secUserId);

    let dlType = downloadType
    if (awemeList.length == 0) {
      dlType = downloadTypeOfAll //表里没有数据，直接全量
    }

    const status = await downloadUserPost(secUserId, undefined, undefined, undefined, dlType);

    log(`第${index + 1}个用户更新完毕~下载了${status.videoCount}个视频,${status.photoCount}张图片，异常图片${status.photoFailCount}张,异常视频${status.videoFailCount}个,耗时${status.downloadTimeCost}秒~`)

    taskStatus.PHOTO_COUNT += status.photoCount
    taskStatus.VIDEO_COUNT += status.videoCount
    taskStatus.DOWNLOAD_TIME_COST += status.downloadTimeCost
    taskStatus.CURRENT = (index + 1)
    taskStatus.PROGRESS = ((index + 1) / total).toFixed(2)
    taskStatus.PHOTO_FAIL_COUNT += status.photoFailCount
    taskStatus.VIDEO_FAIL_COUNT += status.videoFailCount
    taskStatus.FAIL_TOTAL = taskStatus.PHOTO_FAIL_COUNT + taskStatus.VIDEO_FAIL_COUNT

    await addTaskStatus(taskStatus)
    const latestTaskStatus = await getLatestTaskStatus()
    if (latestTaskStatus.ID) {
      await sendTaskStatus({ ...latestTaskStatus });
    }
  }

  log(`本次增量更新更新完毕，下载了${taskStatus.VIDEO_COUNT}个视频,${taskStatus.PHOTO_COUNT}张图片,异常图片${taskStatus.PHOTO_FAIL_COUNT}张,异常视频${taskStatus.VIDEO_FAIL_COUNT}个,耗时${taskStatus.DOWNLOAD_TIME_COST}秒~`);
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