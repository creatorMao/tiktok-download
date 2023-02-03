const Ok = (msg = '请求成功', data = {}) => {
  return {
    state: 'ok',
    msg: msg,
    data
  }
}

const err = (msg = '请求失败', data = {}) => {
  return {
    state: 'err',
    msg: msg,
    data
  }
}

export {
  Ok,
  err
}