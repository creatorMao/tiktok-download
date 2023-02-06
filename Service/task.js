import { initDb } from '../Helper/dbHelper.js'
import { createTableSqlList } from '../Database/createTable.js'
import { getUserList } from './user.js'
import { getSecUserIdFromShortUrl, downloadUserPost } from './userPost.js'
import { dbFilePath, newsCenter } from '../config.js'
import { log } from '../Helper/logHelper.js'
import axios from 'axios'
import { getNowDate } from '../Helper/dateHelper.js'

const startTask = async () => {
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

  for (let index = 0; index < total; index++) {
    const user = userList[index]

    if (user.DOWNLOAD_FLAG == '0') {
      continue
    }

    const status = await downloadUserPost(user['SEC_USER_ID']);

    taskStatus.PHOTO_COUNT += status.photoCount
    taskStatus.VIDEO_COUNT += status.videoCount
    taskStatus.DOWNLOAD_TIME_COST += status.downloadTimeCost
    taskStatus.IMP_TIME = getNowDate();
    taskStatus.CURRENT = (index + 1)
    taskStatus.PROGRESS = ((index + 1) / total).toFixed(2)
    await sendTaskStatus({ ...taskStatus });
  }
}


const sendTaskStatus = async (taskStatus) => {
  const { groupId, url } = newsCenter
  if (url) {
    axios({
      method: 'post',
      url,
      params: {
        groupId,
        content: JSON.stringify(taskStatus)
      }
    }).then((res) => {
      console.log('下载状态发送成功！');
    }).catch(res => {
      console.log('下载状态发送失败');
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