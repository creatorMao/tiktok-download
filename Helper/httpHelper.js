import axios from 'axios'
import { headers, retryCount, delayTimeOut } from '../Config/config.js'
import { log } from './logHelper.js'
import { delay } from './dateHelper.js'

const request = axios.create({ headers });

const getParam = (req, key, isLog = true) => {
  let queryRes = "";
  let bodyRes = "";

  if (req.query) {
    queryRes = req.query[key]
  }

  if (req.body) {
    bodyRes = req.body[key]
  }

  let res = queryRes || bodyRes || "";
  if (isLog) { log(`获取到参数:${key},参数值:${res}`) }
  return res
}

const requestWithRetry = async (requestFunction, checkResultFunction, currentRetryCount = 0) => {
  let res = {}
  try {
    res = await requestFunction();
  }
  catch (e) {
    log(`请求报错，错误信息${e.message}`)
  }

  let checkResFlag = checkResultFunction(res || {});

  if (!checkResFlag) {
    if (currentRetryCount < retryCount) {
      log(`请求结果返回空，正在进行第${currentRetryCount + 1}次重新获取`);
      await delay(delayTimeOut)
      return requestWithRetry(requestFunction, checkResultFunction, currentRetryCount + 1)
    }
    else {
      log(`无数据，彻底跳出~`);
    }
  }
  return res || {}
}

export {
  requestWithRetry,
  request,
  getParam
}