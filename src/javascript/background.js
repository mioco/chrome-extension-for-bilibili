'use strict'

chrome.cookies.getAll({
  domain: 'bilibili.com'
}, cookies => {
  // extracting name and value from bilibili's cookie
  cookies.forEach(cookie => {
    document.cookie = `${cookie.name}=${cookie.value};`
  })
  let api   = 'http://api.bilibili.com/x/web-feed/feed',
      param = {}
      
  chrome.browserAction.setBadgeText({text:"?"});
})

window.fetchData = (api, callback) => {
  let dataObj
  if (window.fetch) {
    fetch(api, {
      'credentials': 'include'
    })
    .then(res => res.json())
    .then(data => callback(data))
  }
}

window.getCookie = () => {
  return document.cookie
}