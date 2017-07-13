'use strict'
class Data {
  constructor () {
    this.userInfo = {};
    this.videoList = [];
    this.bangumiList = [];

    chrome.cookies.getAll({
      domain: 'bilibili.com'
    }, cookies => {
      this.getData();
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

  getData () {
    const videoApi   = 'http://api.bilibili.com/x/web-feed/feed',
          userApi    = 'http://space.bilibili.com/ajax/member/MyInfo';

    this.fetchData(userApi, data => {
      this.userInfo = data;
    }).then(() => {
      if(this.userInfo.status) {
        this.fetchData(videoApi, data => {
          data['data'].forEach(e => {
            e.bangumi ? this.bungumi.push(e) : this.videoList.push(e);
          })
        }, {
          _: Date.parse(new Date())
        })
      }
    })
  }
}


/*On install*/
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', JSON.stringify(details, null, 2));
});

window.data = new Data();