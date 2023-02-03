import { initDb } from './Helper/dbHelper.js'
import { createTableSqlList } from './Database/createTable.js'
import { getSecUserId } from './Service/user.js'

const test = async () => {
  const secUserId = await getSecUserId('https://v.douyin.com/BrxLjv2/');
  console.log(secUserId);
}

const init = async () => {
  await initDb('./Database/basedb.db', createTableSqlList);
  test();
}

init();
