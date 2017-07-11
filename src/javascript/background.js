'use strict'

chrome.cookies.getAll({
  domain: 'bilibili.com'
}, cookies => {
  let api   = 'http://api.bilibili.com/x/web-feed/feed',
      param = {}
      
  chrome.browserAction.setBadgeText({text:"10"});
})

window.fetchData = (api, callback, param, header = {}, needCredentials = true) => {
  if (typeof header !== 'object' && typeof header === 'boolean') needCookie = header;
  webRequest(header)
  let newApi = !param ? api : api + '?' + Object.keys(param).reduce((result, key) => {
    return result += `${result ? '&' : ''}${key}=${param[key]}` 
  }, '');
  if (window.fetch) {
    fetch(newApi, {
      'credentials': needCredentials ? 'include' : 'omit'
    })
    .then(res => res.json())
    .then(data => callback ? callback(data) : data)
  }
}