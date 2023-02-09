import Guid from 'guid'
import jwt from 'jsonwebtoken'

const createGuid = () => {
  return Guid.create().value
}

const generateToken = (data, secret) => {
  let token = jwt.sign(data, secret);
  return token;
}

const getDecryptToken = (token, secret) => {
  let data = jwt.verify(token, secret);
  return data;
}

//根据传入长度产生随机字符串
const generateRandomStr = (randomlength = 16) => {
  let text = "";

  let baseStr = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789='
  for (let i = 0; i < randomlength; i++) {
    text += baseStr[Math.floor(Math.random() * (baseStr.length - 1))]
  }

  return text
}

export {
  generateRandomStr,
  createGuid,
  generateToken,
  getDecryptToken
}