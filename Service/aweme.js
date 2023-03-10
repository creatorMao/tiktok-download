import { getRowsBySql, runSql } from '../Helper/dbHelper.js'
import { createGuid } from '../Helper/generatorHelper.js'

const getAwemeDetail = async (awemeId, awemeFileUrl = "") => {
  let sql = `
  select * from AWEME where AWEME_ID=$AWEME_ID AND AWEME_FILE_URL=$AWEME_FILE_URL
`
  const resRaw = await getRowsBySql(sql, {
    $AWEME_ID: awemeId,
    $AWEME_FILE_URL: awemeFileUrl
  })

  if (resRaw && resRaw.length > 0) {
    return resRaw[0]
  }
  return {}
}

const getUserAwemeList = async (secUserId) => {
  let sql = `select * from AWEME where SEC_USER_ID=$SEC_USER_ID order by create_time desc`

  const resRaw = await getRowsBySql(sql, {
    $SEC_USER_ID: secUserId
  })

  return resRaw
}

const addAweme = async ({ secUserId, awemeId, awemeType, desc, awemeFileUrl, createTime }) => {
  const awemeDetail = await getAwemeDetail(awemeId, awemeFileUrl);
  if (awemeDetail.ID) {
    return {
      msg: '该作品记录已存在，无需重新添加！',
      flag: false
    }
  }
  else {
    let sql = `insert into AWEME(ID,SEC_USER_ID,AWEME_ID,AWEME_TYPE,DESC,AWEME_FILE_URL,CREATE_TIME)
              values($ID,$SEC_USER_ID,$AWEME_ID,$AWEME_TYPE,$DESC,$AWEME_FILE_URL,$CREATE_TIME)
    `

    const resRaw = await runSql(sql, {
      $ID: createGuid(),
      $SEC_USER_ID: secUserId,
      $AWEME_ID: awemeId,
      $AWEME_TYPE: awemeType,
      $DESC: desc,
      $AWEME_FILE_URL: awemeFileUrl,
      $CREATE_TIME: createTime
    });

    return resRaw
  }
}

export {
  getUserAwemeList,
  getAwemeDetail,
  addAweme
}