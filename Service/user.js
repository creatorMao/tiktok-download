import axios from 'axios'
import { getQueryParamByUrl } from '../Helper/urlHelper.js'

const getSecUserId = async (userHomeShortUrl) => {
  return await axios.get(userHomeShortUrl)
    .then((res) => {
      return getQueryParamByUrl(res.request.res.responseUrl, "sec_uid")
    });
}

export {
  getSecUserId
}