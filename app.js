import express from 'express'
import { apiPort, dbFilePath } from './Config/config.js'
import { getParam } from './Helper/httpHelper.js'
import { addUser } from './Service/user.js'
import { err, Ok } from './Helper/returnHelper.js'
import { initDb } from './Helper/dbHelper.js'
import { createTableSqlList } from './Config/createTable.js'
import { rootPath } from './Helper/fsHelper.js'
import path from 'path'

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

  app.all('/', async function (req, res) {
    res.sendFile(path.join(rootPath, './web/index.html'))
  })

  app.all('/user/add', async function (req, res) {
    const homeShortUrl = getParam(req, 'homeShortUrl')
    if (!homeShortUrl) {
      res.send(err('请填写homeShortUrl参数！'));
      return
    }

    const { msg } = await addUser(homeShortUrl);
    res.send(Ok(msg));
  })

  app.listen(apiPort, () => {
    console.log(`程序已启动，请访问http://localhost:${apiPort}/`)
  })
}

const init = async () => {
  await initDb(dbFilePath, createTableSqlList);
  initExpress();
}

init();