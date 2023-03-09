import { logFilePath } from '../Config/config.js'
import path from 'path'
import fs, { existsSync, write } from 'fs'
import { createDir, rootPath } from './fsHelper.js'
import { getNowDate } from './dateHelper.js'

let currentLogFileName = ""; //当前日志文件名
let logData = [] //当前日志数据
let currentLogPath = "" //当前日志目录

const restartLog = (fileName = getNowDate('YYYY-MM-DD-HH-mm-ss')) => {
  const pathPrefix = path.join(rootPath, logFilePath)
  createDir(pathPrefix)
  currentLogPath = path.join(pathPrefix, `./${getNowDate('YYYY-MM-DD')}`)
  createDir(currentLogPath)
  currentLogFileName = `${fileName}.txt`;
  logData = []
}

const logLevelConst = {
  errorLevel: 'error',
  infoLevel: 'info'
}

const getLogLevelText = (logLevel) => {
  let res = "";
  switch (logLevel) {
    case logLevelConst.errorLevel:
      res = "异常"
      break;
    case logLevelConst.infoLevel:
      res = "日志"
      break;
    default:
      res = "日志"
      break;
  }
  return res
}

const log = (logText, logLevel = logLevelConst.infoLevel) => {
  if (logText) {
    if (!currentLogFileName) {
      restartLog();
    }

    logText = `${getNowDate('YYYY-MM-DD-HH-mm-ss')}【${getLogLevelText(logLevel)}】${logText}`
    console.log(logText);//控制台输出

    logText += "\n"
    fs.appendFileSync(path.join(currentLogPath, "/" + currentLogFileName), logText, 'utf8');

    logData.push({
      logLevel,
      logText
    })
  }
}

const getLogData = (countLimit, logLevel = logLevelConst.infoLevel) => {
  let resRaw = logData

  if (logLevel == logLevelConst.errorLevel) {
    resRaw = resRaw.filter((item) => {
      return item.logLevel == logLevelConst.errorLevel
    })
  }

  if (countLimit) {
    let logLength = resRaw.length
    if (logLength < countLimit) {
      return resRaw
    }
    else {
      return resRaw.slice(logLength - countLimit)
    }
  }

  return resRaw
}

export {
  getLogData,
  logData,
  restartLog,
  log,
  logLevelConst as logLevel
}