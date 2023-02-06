import { getRowsBySql, runSql } from '../Helper/dbHelper.js'
import { Ok, err } from '../Helper/returnHelper.js'
import { getSecUserIdFromShortUrl } from './userPost.js'
import { createGuid } from '../Helper/generatorHelper.js'

const getUserList = async () => {
  return await getRowsBySql('SELECT * FROM USER');
}

const addUser = async (homeShortUrl) => {
  const secUserId = await getSecUserIdFromShortUrl(homeShortUrl);

  let sql = `insert into USER(ID,HOME_SHORT_URL,SEC_USER_ID)
              values($ID,$HOME_SHORT_URL,$SEC_USER_ID)
    `
  runSql(sql, {
    $ID: createGuid(),
    $HOME_SHORT_URL: homeShortUrl,
    $SEC_USER_ID: secUserId
  });

  return Ok();
}

export {
  addUser,
  getUserList
}