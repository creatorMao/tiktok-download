import dayjs from 'dayjs'
import { log } from './logHelper.js'

const calcSecondDifference = (beginDate, endDate) => {
  return parseInt(((endDate - beginDate) / 1000).toFixed(0))
}

const getNowDate = (format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs().format(format)
}

const delay = async (timeout, text = "") => {
  log(`${text ? text + ' ' : ''}延迟${(timeout / 1000).toFixed(1)}秒~`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  })
}

export {
  delay,
  calcSecondDifference,
  getNowDate
}