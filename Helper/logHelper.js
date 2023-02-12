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

const log = (logText) => {
  if (logText) {
    console.log(logText);

    if (!currentLogFileName) {
      restartLog();
    }

    logText = `${getNowDate('YYYY-MM-DD-HH-mm-ss: ')}${logText}\n`

    fs.appendFileSync(path.join(currentLogPath, "/" + currentLogFileName), logText, 'utf8');

    logData += logText
  }
}

export {
  logData,
  restartLog,
  log
}