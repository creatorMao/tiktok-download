// let a = Date.now()
// console.log('begin');
// for (let i = 0; i <= 2000000000; i++) {
//   if (i == 2000000000) {
//     let b = Date.now()
//     console.log('end');
//     let c = b - a
//     console.log((0 / 1000).toFixed(0));
//   }
// }


// import { getSecond, getNowDate } from './Helper/dateHelper.js'
// console.log(getNowDate());

import { saveFile } from '../Helper/fsHelper.js'
console.log(2);
const res = await saveFile('http://localhost:3000/asset?url=./MS4wLjABAAAAvWBAHj1Y6X6C7oCmFp3CZXqXSVh_A0P4MrCh92u30cE/7157677576385793318-v0300fg10000cdaipf3c77u5oudp5d8g.mp4', './Data/test', '1.mp4')
// const res = await saveFile('http://localhost:3000/asset?url=./data/MS4wLjABAAAAvWBAHj1Y6X6C7oCmFp3CZXqXSVh_A0P4MrCh92u30cE/11.txt', './Data/test', '1.txt')
// const res = await saveFile('https1://t8.baidu.com/it/u=3616464563,3199287374&fm=217&app=125&size=f242,162&n=0&g=0n&f=JPEG?s=7FEAAB561F5F7CC80C490BFB0300903C&sec=1675929937&t=aafa7485378d4856ce31b0fcd97a1de0', './Data/test', '1.jpg')
console.log(res);
console.log(1);


// import { addAweme } from './Service/aweme.js'
// import { dbFilePath } from './Config/config.js'
// import { createTableSqlList } from './Config/createTable.js'
// import { initDb } from './Helper/dbHelper.js'
// const init = async () => {
//   await initDb(dbFilePath, createTableSqlList);
// }
// await init()

// console.log(1);
// const addRes = await addAweme({
//   'secUserId': 'secUserId',
//   'awemeId': 'awemeId',
//   'awemeType': 'awemeType',
//   'desc': 'desc',
//   'awemeFileUrl': 'awemeFileUrl'
// })
// console.log(addRes);
// console.log(2)

// import { generateRandomStr } from './Helper/generatorHelper.js'
// import { headers } from './Config/config.js'
// console.log(headers)
// console.log(headers)

// import { request, requestWithRetry } from './Helper/httpHelper.js'

// console.log('1');
// const res = await requestWithRetry(() => {
//   return request.get('http://1:3000/news/get?groupId=a1')
//     .then((res) => {
//       return res.data
//     })
// })
// console.log(res)
// console.log('2');


// import { CronJob } from 'cron'
// import { startTask } from './Service/task.js'

// console.log(1)
// console.log(CronJob)
// let job = new CronJob(
//   '1 18,20 17 * * *',
//   () => {
//     startTask(true)
//   },
//   null,
//   true
// );
// console.log(2)


// import url from 'url'
// import { removeQueryParam } from './Helper/urlHelper.js'
// let urlText = "https://www.douyin.com/user/MS4wLjABAAAA8wxawYDUArgcTYVlqVW1lmzNnP8VGWXXa1YZctg9xfI"
// const urlObj = url.parse(urlText)
// console.log(urlObj.path)
// console.log(urlObj)
// console.log(removeQueryParam(urlText));

// import { createCookieString } from '../Helper/generatorHelper.js'

// console.log(createCookieString([
//   ['1', '2'],
//   ['4', '5'],
//   ['3', '4']
// ]))