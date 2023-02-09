import { getRowsBySql, runSql } from '../Helper/dbHelper.js'
import { createGuid } from '../Helper/generatorHelper.js'

const getAwemeDetail = async (awemeId) => {
  let sql = `
  select * from AWEME where AWEME_ID=$AWEME_ID
`
  const resRaw = await getRowsBySql(sql, {
    $AWEME_ID: awemeId
  })

  if (resRaw && resRaw.length > 0) {
    return resRaw[0]
  }
  return {}
}

const addAweme = async ({ secUserId, awemeId, awemeType, desc, awemeFileUrl }) => {
  const awemeDetail = await getAwemeDetail(awemeId);
  if (awemeDetail.ID) {
    return {
      msg: '该作品记录已存在，无需重新添加！',
      flag: false
    }
  }
  else {
    let sql = `insert into AWEME(ID,SEC_USER_ID,AWEME_ID,AWEME_TYPE,DESC,AWEME_FILE_URL)
              values($ID,$SEC_USER_ID,$AWEME_ID,$AWEME_TYPE,$DESC,$AWEME_FILE_URL)
    `

    const resRaw = await runSql(sql, {
      $ID: createGuid(),
      $SEC_USER_ID: secUserId,
      $AWEME_ID: awemeId,
      $AWEME_TYPE: awemeType,
      $DESC: desc,
      $AWEME_FILE_URL: awemeFileUrl
    });

    return resRaw
  }
}

export {
  getAwemeDetail,
  addAweme
}