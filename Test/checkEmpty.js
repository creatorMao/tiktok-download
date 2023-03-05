import fs from 'fs'
import { getFileInfo, getDirList, getFiles } from '../Helper/fsHelper.js'


const path = './Data/'
const emptyList = []

const userDirList = getDirList(path, ['Log', 'ApiDemo'])
console.log(`总共有${userDirList.length}个文件夹`);

for (let index = 0; index < userDirList.length; index++) {
  console.log(`正在处理第${index + 1}个文件夹`);
  const userDir = userDirList[index];
  const userAllFiles = getFiles(`${path}/${userDir}`)
  console.log(`总共有${userAllFiles.length}个文件`);

  for (let j = 0; j < userAllFiles.length; j++) {
    const size = getFileInfo(`${path}/${userDir}/${userAllFiles[j]}`).size
    if (size == 0) {
      emptyList.push(userDir)
      continue
    }
  }
}

console.log(Array.from(new Set(emptyList)));