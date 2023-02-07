import { getRowsBySql, runSql } from '../Helper/dbHelper.js'
import { Ok, err } from '../Helper/returnHelper.js'
import { getSecUserIdFromShortUrl } from './userPost.js'
import { createGuid } from '../Helper/generatorHelper.js'

const getUserList = async () => {
  return await getRowsBySql('SELECT * FROM USER');
}

const getUserDetail = async (secUserId) => {
  let sql = `
   select * from USER where SEC_USER_ID=$secUserId
`
  return await getRowsBySql(sql, {
    $secUserId: secUserId
  })
}

const addUser = async (homeShortUrl) => {
  const secUserId = await getSecUserIdFromShortUrl(homeShortUrl);
  const userInfo = await getUserDetail(secUserId)
  if (userInfo.length > 0) {
    return {
      msg: '该用户已存在，无需重新添加',
      flag: false
    }
  }
  else {
    let sql = `insert into USER(ID,HOME_SHORT_URL,SEC_USER_ID)
              values($ID,$HOME_SHORT_URL,$SEC_USER_ID)
    `
    runSql(sql, {
      $ID: createGuid(),
      $HOME_SHORT_URL: homeShortUrl,
      $SEC_USER_ID: secUserId
    });

    return {
      flag: true,
      msg: '已成功添加！'
    }
  }
}

export {
  addUser,
  getUserList
}