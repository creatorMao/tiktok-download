import { logFilePath } from '../Config/config.js'
import path from 'path'
import fs, { existsSync, write } from 'fs'
import { createDir, rootPath } from './fsHelper.js'
import { getNowDate } from './dateHelper.js'

let currentLogFileName = "";
let logData = ""

const restartLog = (fileName = getNowDate('YYYY-MM-DD-HH-mm-ss')) => {
  createDir(path.join(rootPath, logFilePath))
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

    const filePath = path.join(rootPath, logFilePath + "/" + currentLogFileName)
    fs.appendFileSync(filePath, logText, 'utf8');

    logData += logText
  }
}

export {
  logData,
  restartLog,
  log
}