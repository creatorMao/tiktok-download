import express from 'express'
import { apiPort, dbFilePath, dataPath } from './Config/config.js'
import { getParam } from './Helper/httpHelper.js'
import { addUser, updateUserDownloadFlag, getUserList } from './Service/user.js'
import { err, Ok } from './Helper/returnHelper.js'
import { initDb } from './Helper/dbHelper.js'
import { sqlList } from './Config/sql.js'
import { rootPath, createDir } from './Helper/fsHelper.js'
import path from 'path'
import { log, getLogData } from './Helper/logHelper.js'
import { startTask } from './Service/task.js'
import { getLatestTaskStatus } from './Service/taskStatus.js'
import { startCronJob } from './Service/cronJob.js'
import fs from 'fs'

const initExpress = () => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.all('*', (req, res, next) => {
    // google需要配置，否则报错cors error
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    // 允许的地址,http://127.0.0.1:9000这样的格式
    res.setHeader('Access-Control-Allow-Origin', "*")
    // 允许跨域请求的方法
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, OPTIONS, DELETE, PUT'
    )
    // 允许跨域请求header携带哪些东西
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since'
    )
    next()
  })

  app.get('/', async function (req, res) {
    res.sendFile(path.join(rootPath, './Web/Simple/user.html'))
  })

  app.post('/user/add', async function (req, res) {
    const url = getParam(req, 'url')
    log(`获取到url参数：${url}`)
    if (!url) {
      res.send(err('请填写url参数！'));
      return
    }

    const { msg } = await addUser(url);
    log(msg)
    res.send(Ok(msg));
  })

  app.post('/user/search', async function (req, res) {
    const keyword = getParam(req, 'keyword')
    res.send(Ok('', await getUserList(keyword)));
  })

  app.post('/user/downloadflag', async function (req, res) {
    log('请求到修改用户下载状态接口')
    const secUserId = getParam(req, 'secUserId')
    const downloadFlag = getParam(req, 'downloadFlag')
    if (secUserId) {
      const list = secUserId.split(',')
      for (let index = 0; index < list.length; index++) {
        await updateUserDownloadFlag(list[index], downloadFlag);
      }
    }
    else {
      await updateUserDownloadFlag('', downloadFlag)
    }

    res.send(Ok());
  })

  app.get('/log/latest', async function (req, res) {
    res.send(Ok('日志获取成功~', getLogData(300).join('')))
  })

  app.post('/task/start', async function (req, res) {
    const sort = getParam(req, 'sort')
    const userList = getParam(req, 'userList')
    const downloadType = getParam(req, 'downloadType')
    startTask(undefined, sort, userList ? JSON.parse(userList) : userList, downloadType)
    res.send(Ok('已启动~'))
  })

  app.get('/server/close', async function (req, res) {
    res.send(Ok('正在关闭中~'))
    process.kill(process.pid, 'SIGTERM');
  })

  app.get('/task/status/latest', async function (req, res) {
    res.send(Ok('', await getLatestTaskStatus()))
  })

  app.get('/asset', async function (req, res) {
    const url = getParam(req, 'url', false)
    if (!url) {
      res.send(err('url参数未填写！'))
    }
    fs.readFile(`${url}`, function (err, data) {
      res.end(data)
    })
  })

  app.listen(apiPort, () => {
    log(`后台程序已启动，如想访问简易的web页面请访问http://localhost:${apiPort}/`)
  })

  process.on('SIGTERM', () => {
    app.close(() => {
    })
  })
}

const initDataPath = () => {
  const fileSavePath = path.join(rootPath, dataPath)
  const { existFlag } = createDir(fileSavePath)
  if (existFlag) {
    log('文件夹已存在，将跳过');
  }
  else {
    log('文件夹初始化成功~');
  }
  log(`数据文件夹路径:${fileSavePath}`);
}

const init = async () => {
  log('正在初始化~');
  initDataPath();
  await initDb(dbFilePath, sqlList);
  startCronJob();
  initExpress();
}

init();