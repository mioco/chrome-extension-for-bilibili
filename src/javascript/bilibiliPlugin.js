'use strict';

class BilibiliPlugin {
  constructor () {
    this.PROFIX = 'bilibili-plugin-',
    this.getStorage = new Promise(resolve => {
      chrome.storage.sync.get(null, val => {
        resolve(val)
      })
    })
    this.setState = new Proxy(this, {
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
  }

  init (state) {
    this.state = state
    Array.from(document.querySelectorAll('.bp-prefrence-checkbox')).forEach(ele => {
      ele.addEventListener('change', e => {
        this.setState[ele.name] = Number(e.target.checked)
      })
      ele.checked = this.setState[ele.name]
    })
  }
}

let start = new BilibiliPlugin()
start.getStorage.then(state => start.init(state))