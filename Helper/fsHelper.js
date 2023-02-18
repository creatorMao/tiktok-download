import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { retryCount, delayTimeOut } from '../Config/config.js'
import { fileURLToPath } from 'url'
import { log } from './logHelper.js'
const filename = fileURLToPath(import.meta.url) // 这里不能声明__filename,因为已经有内部的__filename了，重复声明会报错
const _dirname = path.dirname(filename)
const rootPath = path.join(_dirname, "../")
import { delay } from './dateHelper.js'

const createDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    return {
      existFlag: false
    }
  }
  else {
    return {
      existFlag: true
    }
  }
}

const deleteFile = (path) => {
  // log(path);
  if (fs.existsSync(path)) {
    // log(12);
    fs.unlinkSync(path);
  }
}

const saveFile = async (url, filePath, fileName, retryFlag = true, retryCountTotal = 3, currentRetryCount = 0) => {
  if (!retryCountTotal) {
    retryCountTotal = retryCount
  }

  const fileUrlAbs = path.join(rootPath, filePath + "/" + fileName)
  let res = {
    msg: '',
    existFlag: false,
    downloadSuccessFlag: false,
    fileUrlAbs: fileUrlAbs,
    fileUrl: filePath + "/" + fileName
  }
  let writer = undefined

  if (fs.existsSync(fileUrlAbs)) {
    res.msg = "文件已存在！"
    res.existFlag = true
    return res
  }
  else {
    try {
      createDir(path.join(rootPath, filePath))

      log('正在下载文件~');
      const response = await axios({
        url,
        method: 'GET',
        timeout: 1000 * 60 * 10 * 2, //20分钟下载不下来，不下了~
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          // log(JSON.stringify(progressEvent));
          //{"loaded":1589014,"total":3214424,"progress":0.49433864356413465,"bytes":16384,"rate":11650,"estimated":139.52017167381973,"download":true}
          const { progress } = progressEvent
          log(`下载进度：${(progress * 100).toFixed(2)}%`);
        },
      })

      fs.writeFileSync(fileUrlAbs, response.data, 'binary')

      res.msg = "文件下载成功！"
      res.downloadSuccessFlag = true
      return res
    }
    catch (err) {
      try {
        deleteFile(fileUrlAbs);
      }
      catch (e) {
        log(e.message);
      }

      if (retryFlag && currentRetryCount < retryCountTotal) {
        log(`可能因为网络原因，第${currentRetryCount + 1}次下载失败，正在进行第${currentRetryCount + 2}次尝试！`);
        await delay(delayTimeOut)
        return await saveFile(url, filePath, fileName, true, retryCountTotal, currentRetryCount + 1);
      }
      else {
        log('仍然下载失败，彻底跳出~')
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