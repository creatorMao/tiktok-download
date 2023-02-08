const homeUrlPrefix = "https://www.douyin.com/user/"
const retryCount = 3 //重试次数
const apiPort = 3000
const dbFilePath = './Data/basedb.db'
const newsCenter = {
  groupId: 'tiktok-download-status',
  url: ''
}
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'referer': 'https://www.douyin.com/'
}

export {
  newsCenter,
  homeUrlPrefix,
  retryCount,
  apiPort,
  dbFilePath,
  headers
}