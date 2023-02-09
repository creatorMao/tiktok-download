import { logFilePath } from '../Config/config.js'
import path from 'path'
import fs, { existsSync, write } from 'fs'
import { createDir, rootPath } from './fsHelper.js'
import { getNowDate } from './dateHelper.js'

let currentLogFileName = "";

const restartLog = (fileName = getNowDate('YYYY-MM-DD-HH-mm-ss')) => {
  createDir(path.join(rootPath, logFilePath))
  currentLogFileName = `${fileName}.txt`;
}

const log = (text) => {
  if (text) {
    console.log(text);

    if (!currentLogFileName) {
      restartLog();
    }

    const filePath = path.join(rootPath, logFilePath + "/" + currentLogFileName)
    fs.appendFileSync(filePath, `${text}\n`, 'utf8');
  }
}

export {
  restartLog,
  log
}