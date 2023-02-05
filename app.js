import { initDb } from './Helper/dbHelper.js'
import { createTableSqlList } from './Database/createTable.js'
import { getSecUserIdFromShortUrl, downloadUserPost } from './Service/user.js'
import { savePicture } from './Helper/fsHelper.js'

const test = async () => {
  const secUserId = await getSecUserIdFromShortUrl('https://v.douyin.com/BSAbFGb/');
  downloadUserPost(secUserId);
  // console.log(secUserId);
}

const init = async () => {
  await initDb('./Database/basedb.db', createTableSqlList);
  test();
}

init();
