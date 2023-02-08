import fs, { existsSync, write } from 'fs'
import path from 'path'
import axios from 'axios'
import { retryCount } from '../Config/config.js'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url) // 这里不能声明__filename,因为已经有内部的__filename了，重复声明会报错
const _dirname = path.dirname(filename)
const rootPath = path.join(_dirname, "../")

const createDir = (path) => {
  if (!existsSync(path)) {
    fs.mkdirSync(path);
  }
}

const deleteFile = (path) => {
  if (existsSync(path)) {
    fs.unlinkSync(path);
  }
}

const saveFile = async (url, filePath, fileName, retryFlag = true, retryCountTotal = 3, currentRetryCount = 0) => {
  if (!retryCountTotal) {
    retryCountTotal = retryCount
  }

  const filePathAbs = path.join(rootPath, filePath + "/" + fileName)
  let res = {
    msg: '',
    existFlag: false,
    downloadSuccessFlag: false
  }
  let writer = undefined

  if (fs.existsSync(filePathAbs)) {
    res.msg = "文件已存在！"
    res.existFlag = true
    return res
  }
  else {
    try {
      createDir(path.join(rootPath, filePath))

      writer = fs.createWriteStream(filePathAbs)
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      })
      response.data.pipe(writer)

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          res.msg = "文件下载成功！"
          res.downloadSuccessFlag = true
          resolve(res);
        })
        writer.on('error', async (err, writer) => {
          if (writer) {
            writer.end();
            writer.destroy();
            deleteFile(filePathAbs);
          }

          if (retryFlag && currentRetryCount < retryCountTotal) {
            console.log(`可能因为网络原因，第${currentRetryCount + 1}次下载失败，正在进行第${currentRetryCount + 1}次尝试！`);
            resolve(await saveFile(url, filePath, fileName, true, undefined, currentRetryCount + 1));
          }
          else {
            res.msg = "文件下载失败！"
            resolve(res);
          }
        })
      })
    }
    catch (err) {
      if (writer) {
        writer.end();
        writer.destroy();
        deleteFile(filePathAbs);
      }
      if (retryFlag && currentRetryCount < retryCountTotal) {
        console.log(`可能因为网络原因，第${currentRetryCount + 1}次下载失败，正在进行第${currentRetryCount + 2}次尝试！`);
        return await saveFile(url, filePath, fileName, true, retryCountTotal, currentRetryCount + 1);
      }
      else {
        res.msg = err.message
        return res
      }
    }
  }
}

export {
  rootPath,
  createDir,
  saveFile
}