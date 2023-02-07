import { getRowsBySql, runSql } from '../Helper/dbHelper.js'
import { Ok, err } from '../Helper/returnHelper.js'
import { getSecUserIdFromShortUrl, getUserInfo } from './userPost.js'
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
  const userDetail = await getUserDetail(secUserId)
  if (userDetail.length > 0) {
    return {
      msg: '该用户已存在，无需重新添加',
      flag: false
    }
  }
  else {
    const { nickName, picPathFull } = await getUserInfo(secUserId);
    let sql = `insert into USER(ID,HOME_SHORT_URL,SEC_USER_ID,NICK_NAME,USER_PIC)
              values($ID,$HOME_SHORT_URL,$SEC_USER_ID,$NICK_NAME,$USER_PIC)
    `
    runSql(sql, {
      $ID: createGuid(),
      $HOME_SHORT_URL: homeShortUrl,
      $SEC_USER_ID: secUserId,
      $NICK_NAME: nickName,
      $USER_PIC: picPathFull
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