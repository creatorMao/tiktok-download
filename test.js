let a = Date.now()
console.log('begin');
for (let i = 0; i <= 2000000000; i++) {
  if (i == 2000000000) {
    let b = Date.now()
    console.log('end');
    let c = b - a
    console.log((0 / 1000).toFixed(0));
  }
}


// import { getSecond, getNowDate } from './Helper/dateHelper.js'
// console.log(getNowDate());