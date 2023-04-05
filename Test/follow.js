JSON.stringify(Array.from(document.getElementsByClassName('vcEWxPjN')).map((item) => {
  const user = {}
  try {
    user.SEC_USER_ID = item.children[1].children[0].children[0].children[0].attributes.href.nodeValue.replace('//www.douyin.com/user/', '')
    user.URL = `https:${item.children[1].children[0].children[0].children[0].attributes.href.nodeValue}`,
      user.NICK_NAME = item.children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML.replace(/(<([^>]+)>)/ig, '')

  }
  catch (e) {

  }
  //console.log(user);
  return { ...user }
}))