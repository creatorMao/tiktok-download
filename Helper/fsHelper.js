import fs, { existsSync } from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url) // 这里不能声明__filename,因为已经有内部的__filename了，重复声明会报错
const _dirname = path.dirname(filename)
const rootPath = path.join(_dirname, "../")

const createDir = (path) => {
  if (!existsSync(path)) {
    fs.mkdirSync(path);
  }
}

const saveFile = async (url, filePath, fileName) => {
  const filePathAbs = path.join(rootPath, filePath + "/" + fileName)

  if (fs.existsSync(filePathAbs)) {
    console.log('文件已存在！');
    return "文件已存在！"
  }
  else {
    createDir(path.join(rootPath, filePath))
    const writer = fs.createWriteStream(filePathAbs)

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }
}

export {
  rootPath,
  createDir,
  saveFile
}