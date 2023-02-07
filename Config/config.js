const homeUrlPrefix = "https://www.douyin.com/user/"
const retryCount = 3 //重试次数
const apiPort = 3000
const dbFilePath = './Download/basedb.db'
const newsCenter = {
  groupId: 'tiktok-download-status',
  url: ''
}
const headers = {
}

export {
  newsCenter,
  homeUrlPrefix,
  retryCount,
  apiPort,
  dbFilePath,
  headers
}