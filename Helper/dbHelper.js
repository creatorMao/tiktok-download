import sqlite3 from 'sqlite3'

let currentDb = null;

const initDb = async (dbFilePath, createTableSqlList) => {

  console.log('正在连接数据库');
  const db = connectDb(dbFilePath);
  console.log('数据库连接成功');

  console.log('正在初始化数据库');
  for (let i = 0; i < createTableSqlList.length; i++) {
    let table = createTableSqlList[i];
    await createTable(table.tableCode, table.tableName, table.sql);
  }
  console.log('数据库初始化成功');
  currentDb = db
  return db;
}

const connectDb = (dbFilePath) => {
  currentDb = new sqlite3.Database(dbFilePath, err => {
  })
  return currentDb;
}

const createTable = async (tableCode, tableName, createTableSql) => {
  const existFlag = await checkTableExist(tableCode);
  let tableText = `表【${tableName}:${tableCode}】`
  if (!existFlag) {
    currentDb.run(createTableSql);
    console.log(`${tableText}创建成功`);
  }
  else {
    console.log(`${tableText}已存在，将跳过`);
  }
}

const checkTableExist = async (tableName) => {
  const sql = `SELECT count(*) AS COUNT FROM sqlite_master WHERE type = 'table' and tbl_name = '${tableName}'`
  const rows = await getRowsBySql(sql, {});
  return rows[0]["COUNT"] != '0'
}

const getRowsBySql = (sql, param = {}) => {
  return new Promise((resolve, reject) => {
    currentDb.all(sql, param, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const runSql = (sql, param = {}) => {
  currentDb.run(sql, param, (err) => {
    console.log(err);
  });
}

export {
  currentDb,
  initDb,
  connectDb,
  createTable,
  runSql,
  getRowsBySql
} 