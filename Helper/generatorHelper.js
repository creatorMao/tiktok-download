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

export {
  createGuid,
  generateToken,
  getDecryptToken
}