import { request } from '../Helper/httpHelper.js'
import { log } from '../Helper/logHelper.js'

let paramTextOld = ""
let xgOld = ""

const getXg = async (paramText) => {
  log('准备开始获取xg参数');

  if (paramText == paramTextOld) {
    log('已在缓存中找到xg');
    log(`获取到xg:${xgOld}`);
    return xgOld
  }

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

  paramTextOld = paramText
  xgOld = xg

  return xg
}

export {
  getXg
}