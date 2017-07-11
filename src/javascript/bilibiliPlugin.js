'use strict';

class BilibiliPlugin {
  constructor () {
    this.PROFIX = 'bilibili-plugin-'
    this.cookie = {}
    // get localStorage and then sync execute init()
    this.getStorage = new Promise(resolve => {
      chrome.storage.sync.get(null, val => {
        resolve(val)
      })
    })

    this.setState = new Proxy(this, {
      // save to localstorage when set state
      set: (target, prop, value) => {
        value = Number(value)
        target.state[prop] = value

        let setStorage = {}
        setStorage[this.PROFIX + prop] = value
        chrome.storage.sync.set(setStorage)
        return true
      },

      get: (target, prop) => Boolean(Number(this.state[this.PROFIX + prop]))
    })

    this.bg = chrome.extension.getBackgroundPage()
  }

  init (state) {
    // sync config to popup
    this.state = state
    Array.from($.getAll('.bp-prefrence-checkbox')).forEach(ele => {
      ele.addEventListener('change', e => {
        this.setState[ele.name] = Number(e.target.checked)
      })
      ele.checked = this.setState[ele.name]
    })
    if (this.checkLogin()) {
      const userApi = 'http://space.bilibili.com/ajax/member/MyInfo',
            vedioApi = 'http://data.bilibili.com/v/web/web_feed';

      // get user info
      this.bg.fetchData(userApi, data => {
        let {coins, face, level_info, mid, s_face, uname} = data['data'];
        this.userInfo = {coins, face, level_info, mid, s_face, uname};

        // insert userinfo into element
        let avatar = $('.bp-profile-avatar')
        avatar.$('img').src = face;
        avatar.$('span').textContent = uname;
      })
    }
  }

  checkLogin () {
    this.bg.getCookie().split(';').forEach(item => {
      let tempArr = item.split('=');
      this.cookie[tempArr[0].trim()] = tempArr[1];
    })
    return true
  }

  refresh () {
    let fragment = new DocumentFragment()
  }
}

window.$ = Element.prototype.$ = function (ele) {
  return document.querySelector(ele);
}
$.getAll = ele => {
  return document.querySelectorAll(ele);
}

let start = new BilibiliPlugin()
start.getStorage.then(state => start.init(state))