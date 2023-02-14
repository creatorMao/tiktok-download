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
      CREATE_TIME       VARCHAR(500),
      IMP_DATE          VARCHAR(10) DEFAULT (date('now')),
      IMP_TIME          VARCHAR(19) DEFAULT (datetime('now','localtime'))
    );
    `
  },
  {
    tableCode: 'TASK_STATUS',
    tableName: '下载记录表',
    sql: `
    CREATE TABLE TASK_STATUS
    (
      ID                  VARCHAR(500)   PRIMARY KEY      NOT NULL,
      TASK_ID             VARCHAR(500),
      PHOTO_COUNT         INT,
      VIDEO_COUNT         INT,
      DOWNLOAD_TIME_COST  INT,
      TOTAL               INT,
      CURRENT             INT,
      PROGRESS            VARCHAR(500),
      PHOTO_FAIL_COUNT    INT,
      VIDEO_FAIL_COUNT    INT,
      FAIL_TOTAL          INT,
      IMP_DATE            VARCHAR(10) DEFAULT (date('now')),
      IMP_TIME            VARCHAR(19) DEFAULT (datetime('now','localtime'))
    );
    `
  }
]


export {
  createTableSqlList
}