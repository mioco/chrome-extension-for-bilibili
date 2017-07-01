'use strict';

class BilibiliPlugin {
  constructor () {
    this.PROFIX = 'bilibili-plugin-',

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
    Array.from(document.querySelectorAll('.bp-prefrence-checkbox')).forEach(ele => {
      ele.addEventListener('change', e => {
        this.setState[ele.name] = Number(e.target.checked)
      })
      ele.checked = this.setState[ele.name]
    })

    if (this.checkLogin()) {
      const api      = 'http://space.bilibili.com/ajax/member/MyInfo'
      const callback = data => {
        this.state.userInfo = {coins, face, level_info, mid, s_face} = data
        
      }

      this.bg.fetchData(api, callback)
    }
  }

  checkLogin () {
    document.cookie = this.bg.getCookie()
    return true
  }

  refresh () {
    let fragment = new DocumentFragment()
    
  }
}

let start = new BilibiliPlugin()
start.getStorage.then(state => start.init(state))