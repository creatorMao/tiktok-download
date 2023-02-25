import { getRowsBySql, runSql } from '../Helper/dbHelper.js'
import { getSecUserIdFromShortUrl, getUserInfo } from './userPost.js'
import { createGuid } from '../Helper/generatorHelper.js'
import { homeUrlPrefix } from '../Config/config.js'
import { log } from '../Helper/logHelper.js'
import { removeQueryParam } from '../Helper/urlHelper.js'

const getUserList = async () => {
  return await getRowsBySql('SELECT * FROM USER order by imp_time desc');
}

const getUserDetail = async (secUserId) => {
  let sql = `
   select * from USER where SEC_USER_ID=$secUserId
`
  return await getRowsBySql(sql, {
    $secUserId: secUserId
  })
}

const getSecUserIdFromUrl = async (url) => {
  url = removeQueryParam(url)
  log(`链接去除掉查询参数后:为【${url}】`);
  let secUserId = ""
  if (url.indexOf(homeUrlPrefix) != "-1") {
    log('该链接属于长链~');
    secUserId = url.replaceAll(homeUrlPrefix, '')
  }
  else {
    log('该链接属于短链~');
    secUserId = await getSecUserIdFromShortUrl(url);
  }
  log(`分析出secUserId为【${secUserId}】`);
  return secUserId
}

const addUser = async (url) => {
  const secUserId = await getSecUserIdFromUrl(url);
  if (!secUserId) {
    return {
      msg: 'secUserId获取不到，请复制正确的主页链接！',
      flag: false
    }
  }

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
    await runSql(sql, {
      $ID: createGuid(),
      $HOME_SHORT_URL: url,
      $SEC_USER_ID: secUserId,
      $NICK_NAME: nickName,
      $USER_PIC: picPathFull
    });

    return {
      flag: true,
      msg: '用户添加成功！'
    }
  }
}

const updateUserDownloadFlag = async (secUserId, downloadFlag) => {
  let sql = `UPDATE USER SET DOWNLOAD_FLAG=$DOWNLOAD_FLAG`
  let param = {
    $DOWNLOAD_FLAG: downloadFlag
  }

  if (secUserId) {
    sql += ` WHERE SEC_USER_ID=$SEC_USER_ID`
    param['$SEC_USER_ID'] = secUserId
  }
  else {

  }

  await runSql(sql, param);

  return {
    flag: true,
    msg: '修改下载状态成功'
  }
}

export {
  addUser,
  getUserList,
  updateUserDownloadFlag
}