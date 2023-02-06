const homeUrlPrefix = "https://www.douyin.com/user/"
const retryCount = 3 //重试次数
const apiPort = 3000
const dbFilePath = './Database/basedb.db'
const newsCenter = {
  groupId: 'tiktok-download-status',
  url: ''
}

export {
  newsCenter,
  homeUrlPrefix,
  retryCount,
  apiPort,
  dbFilePath
}