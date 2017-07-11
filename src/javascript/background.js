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
      
  chrome.browserAction.setBadgeText({text:"10"});
})

window.fetchData = (api, callback, param) => {
  let newApi = !param ? api : api + '?' + Object.keys(param).reduce((result, key) => {
    return result += `${result ? '&' : ''}${key}=${param[key]}` 
  }, '');
  if (window.fetch) {
    fetch(newApi, {
      'credentials': 'include',
      'Origin': 'http://www.bilibili.com'
    })
    .then(res => res.json())
    .then(data => callback ? callback(data) : data)
  }
}

window.getCookie = () => {
  return document.cookie
}