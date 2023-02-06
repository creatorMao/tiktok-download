import { initDb } from '../Helper/dbHelper.js'
import { createTableSqlList } from '../Database/createTable.js'
import { getUserList } from './user.js'
import { getSecUserIdFromShortUrl, downloadUserPost } from './userPost.js'
import { dbFilePath } from '../config.js'

const startTask = async () => {
  await initDb(dbFilePath, createTableSqlList);

  const userList = await getUserList();

  for (let index = 0; index < userList.length; index++) {
    const user = userList[index]

    if (user.DOWNLOAD_FLAG == '0') {
      continue
    }

    downloadUserPost(user['SEC_USER_ID']);
  }
}

export {
  startTask
}