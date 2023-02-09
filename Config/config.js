const homeUrlPrefix = "https://www.douyin.com/user/"
const retryCount = 3 //重试次数
const apiPort = 3000
const dataPath = './Data/' //数据目录
const dbFilePath = dataPath + 'basedb.db' //数据库文件
const logFilePath = dataPath + 'Log/'//日志文件夹
const newsCenter = {
  groupId: 'tiktok-download-status',
  url: ''
}
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'referer': 'https://www.douyin.com/',
}
const delayTimeOut = 1000

export {
  delayTimeOut,
  newsCenter,
  homeUrlPrefix,
  retryCount,
  apiPort,
  dbFilePath,
  headers,
  dataPath,
  logFilePath
}