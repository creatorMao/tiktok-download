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

// import { saveFile } from './Helper/fsHelper.js'
// console.log(2);
// const res = await saveFile('https://suitplay.net/wp-content/uploads/2022/06/00F144AC-46A6-4298-A2B7-92FF1741D9E3.jpeg', './Data/test', '1.mp4')
// // const res = await saveFile('https1://t8.baidu.com/it/u=3616464563,3199287374&fm=217&app=125&size=f242,162&n=0&g=0n&f=JPEG?s=7FEAAB561F5F7CC80C490BFB0300903C&sec=1675929937&t=aafa7485378d4856ce31b0fcd97a1de0', './Data/test', '1.jpg')
// console.log(res);
// console.log(1);


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

import { request, requestWithRetry } from './Helper/httpHelper.js'

console.log('1');
const res = await requestWithRetry(() => {
  return request.get('http://1:3000/news/get?groupId=a1')
    .then((res) => {
      return res.data
    })
})
console.log(res)
console.log('2');