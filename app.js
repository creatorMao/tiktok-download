import { initDb } from './Helper/dbHelper.js'
import { createTableSqlList } from './Database/createTable.js'

const init = async () => {
  await initDb('./Database/basedb.db', createTableSqlList);


}

init();
