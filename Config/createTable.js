const createTableSqlList = [
  {
    tableCode: 'USER',
    tableName: '用户表',
    sql: `
    CREATE TABLE USER
    (
      ID                VARCHAR(500)   PRIMARY KEY      NOT NULL,
      SEC_USER_ID       VARCHAR(500),
      NICK_NAME         VARCHAR(500),
      USER_PIC          VARCHAR(500),
      HOME_SHORT_URL    VARCHAR(500),
      DOWNLOAD_FLAG     VARCHAR(1)  DEFAULT (1),
      IMP_DATE          VARCHAR(10) DEFAULT (date('now')),
      IMP_TIME          VARCHAR(19) DEFAULT (datetime('now','localtime'))
    );
    `
  },
  {
    tableCode: 'AWEME',
    tableName: '作品表',
    sql: `
    CREATE TABLE AWEME
    (
      ID                VARCHAR(500)   PRIMARY KEY      NOT NULL,
      SEC_USER_ID       VARCHAR(500),
      AWEME_ID          VARCHAR(500),
      AWEME_TYPE        VARCHAR(500),
      DESC              TEXT,
      AWEME_FILE_URL    TEXT,
      IMP_DATE          VARCHAR(10) DEFAULT (date('now')),
      IMP_TIME          VARCHAR(19) DEFAULT (datetime('now','localtime'))
    );
    `
  }
]


export {
  createTableSqlList
}