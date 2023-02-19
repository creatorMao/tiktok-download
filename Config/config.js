import { generateRandomStr } from '../Helper/generatorHelper.js'
import { downloadTypeOfUpdate, downloadTypeOfAll } from '../Service/const.js'
const downloadType = downloadTypeOfUpdate
const homeUrlPrefix = "https://www.douyin.com/user/"
const retryCount = 3 //重试次数
const checkDownloadCount = 6 //检查已下载数量跳过数
const apiPort = 3000
const dataPath = './Data/' //数据目录
const dbFilePath = dataPath + 'basedb.db' //数据库文件
const logFilePath = dataPath + 'Log/'//日志文件夹
const newsCenter = {
  groupId: 'tiktok-download-status',
  url: ''
}
const cronJobTime = "1 1 10,16,22 * * *" //每天上午10点1秒、下午4点1秒、晚上10点1秒，各跑一次增量下载，一天总共3次

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  'referer': 'https://www.douyin.com/',
  'cookie': `msToken=${generateRandomStr(107)};odin_tt=324fb4ea4a89c0c05827e18a1ed9cf9bf8a17f7705fcc793fec935b637867e2a5a9b8168c885554d029919117a18ba69;`
}

const delayTimeOut = 2000

export {
  downloadType,
  delayTimeOut,
  newsCenter,
  homeUrlPrefix,
  retryCount,
  apiPort,
  dbFilePath,
  headers,
  dataPath,
  logFilePath,
  checkDownloadCount,
  cronJobTime
}