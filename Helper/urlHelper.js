import url from 'url'
import querystring from 'querystring'

const getQueryParamByUrl = (urlText, key) => {
  let value = ""

  try {
    const queryText = url.parse(urlText).query;
    value = (querystring.parse(queryText))[key]
  }
  catch {
  }

  return value
}

export {
  getQueryParamByUrl
}