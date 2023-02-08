import dayjs from 'dayjs'

const calcSecondDifference = (beginDate, endDate) => {
  return parseInt(((endDate - beginDate) / 1000).toFixed(0))
}

const getNowDate = (format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs().format(format)
}

const delay = async (timeout) => {
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