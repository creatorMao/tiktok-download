import { request } from '../Helper/httpHelper.js'
import { log } from '../Helper/logHelper.js'

let count = 1

const getXg = async (paramText) => {
  log(`准备开始获取xg参数，接口已使用${count}次`);

  paramText = paramText.replaceAll('&', '%26')

  //该逻辑来源于https://github.com/johnserf-seed/tiktokdownload,请支持原作者项目。
  //demo: http://47.115.200.238/xg/path/?url=aid=6383%26sec_user_id=xxx%26max_cursor=0%26count=10
  const url = `http://47.115.200.238/xg/path/?url=${paramText}`
  log(`xg参数，url: ${url}`);

  let res = {}
  let xg = "";

  try {
    res = await request.post(url).then((res) => {
      return res.data
    }).catch((err) => {
      log(`xg参数获取失败~原因: ${err}`);
    })
  }
  catch (e) {
    log(`xg参数获取失败~原因: ${e.message}`);
  }

  const { result = [] } = res || {}
  // log(result);

  if (result.length > 0) {
    xg = result[0]["X-Bogus"]["0"]
    log(`获取到xg:${xg}`);
  }

  count++

  return xg
}

export {
  getXg
}