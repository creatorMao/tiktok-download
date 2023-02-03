const getParam = (req, key) => {
  let queryRes = "";
  let bodyRes = "";

  if (req.query) {
    queryRes = req.query[key]
  }

  if (req.body) {
    bodyRes = req.body[key]
  }

  return queryRes || bodyRes || ""
}

export {
  getParam
}