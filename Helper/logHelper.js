import { logFilePath } from '../Config/config.js'
import path from 'path'
import fs, { existsSync, write } from 'fs'
import { createDir, rootPath } from './fsHelper.js'
import { getNowDate } from './dateHelper.js'

let currentLogFileName = ""; //当前日志文件名
let logData = undefined //当前日志数据
let currentLogPath = "" //当前日志目录

const restartLog = (fileName = getNowDate('YYYY-MM-DD-HH-mm-ss')) => {
  const pathPrefix = path.join(rootPath, logFilePath)
  createDir(pathPrefix)
  currentLogPath = path.join(pathPrefix, `./${getNowDate('YYYY-MM-DD')}`)
  createDir(currentLogPath)
  currentLogFileName = `${fileName}.txt`;
  logData = ""
}

const getLogLevelText = (logLevel) => {
  let res = "";
  switch (logLevel) {
    case "error":
      res = "异常"
      break;
    default:
      res = "日志"
      break;
  }
  return res
}

const log = (logText, logLevel) => {
  if (logText) {
    if (!currentLogFileName) {
      restartLog();
    }

    logText = `${getNowDate('YYYY-MM-DD-HH-mm-ss')}【${getLogLevelText(logLevel)}】${logText}`
    console.log(logText);//控制台输出

    logText += "\n"
    fs.appendFileSync(path.join(currentLogPath, "/" + currentLogFileName), logText, 'utf8');

    logData += logText
  }
}

const logLevel = {
  errorLevel: 'error'
}

export {
  logData,
  restartLog,
  log,
  logLevel
}