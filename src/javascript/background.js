'use strict'
class Data {
  constructor () {
    this.userInfo = {};
    this.videoList = {};

    chrome.cookies.getAll({
      domain: 'bilibili.com'
    }, cookies => {
      const videoApi   = 'http://api.bilibili.com/x/web-feed/feed',
            userApi    = 'http://space.bilibili.com/ajax/member/MyInfo',
            param      = {};

      this.fetchData(userApi, data => {
        this.userInfo = data;
      }).then(() => {
        if(this.userInfo.status) {
          this.fetchData(videoApi, data => {
            this.videoList = data['data'];
          }, {
            _: Date.parse(new Date())
          })
        }
      })
      chrome.browserAction.setBadgeText({text:"10"});
    })
  }

  /**
   * 
   * @param {string} api 
   * @param {function} callback 
   * @param {object} param 
   * @param {object} header 
   * @param {boolean} needCredentials 
   */
  fetchData (api, callback, param, header = {}, needCredentials = true) {
    return new Promise((resolve, reject) => {
      // if no header
      if (typeof header !== 'object' && typeof header === 'boolean') needCredentials = header;

      // cors
      webRequest(header)

      // parse param
      let newApi = !param ? api : api + '?' + Object.keys(param).reduce((result, key) => {
        return result += `${result ? '&' : ''}${key}=${param[key]}` 
      }, '');

      // start request
      if (window.fetch) {
        fetch(newApi, {
          'credentials': needCredentials ? 'include' : 'omit'
        })
        .then(res => res.json())
        .then(data => callback ? void function (data) {
          callback(data);
          resolve();
        }(data) : data)
      }
      
    })
  }
}

window.data = new Data();