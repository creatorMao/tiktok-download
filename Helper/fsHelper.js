import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url) // 这里不能声明__filename,因为已经有内部的__filename了，重复声明会报错
const _dirname = path.dirname(filename)
const rootPath = path.join(_dirname, "../")

const createDir = (path) => {
  fs.exists(path, function (exists) {
    if (!exists) {
      fs.mkdirSync(path);
    }
  });
}

const savePicture = (url, filePath, fileName) => {
  https.get(url, function (req, res) {
    let imgData = '';
    req.on('data', function (chunk) {
      imgData += chunk;
    })
    req.setEncoding('binary');
    req.on('end', function () {
      createDir(filePath);
      const filePathAbs = path.join(rootPath, filePath + "/" + fileName)
      console.log(filePathAbs);
      fs.writeFile(filePathAbs, imgData, 'binary', function (err) {
        console.log(err);
      })
    })
  })
}

export {
  createDir,
  savePicture
}