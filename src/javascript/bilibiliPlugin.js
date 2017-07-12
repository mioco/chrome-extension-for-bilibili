'use strict';

class BilibiliPlugin {
  constructor () {
    this.PROFIX = 'bilibili-plugin-'
    this.cookie = {}
    this.islogin = false

    // get localStorage and then sync execute init()
    this.getStorage = new Promise(resolve => {
      chrome.storage.sync.get(null, val => {
        resolve(val)
      })
    })

    // preferences information in this.state
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
    // sync config to popup.html
    this.state = state
    Array.from($.getAll('.bp-preference-checkbox')).forEach(ele => {
      ele.addEventListener('change', e => {
        this.setState[ele.name] = Number(e.target.checked)
      })
      ele.checked = this.setState[ele.name]
    })

    // get user info
    const userApi = 'http://space.bilibili.com/ajax/member/MyInfo';
    this.bg.fetchData(userApi, data => {
      if (!data.status) {
        this.islogin = false;
        $('.bp-notLogin').removeClass('hidden').addEventListener('click', this.login);
        $('.bp-profile').addClass('hidden');
        return false;
      } else {
        let {coins, face, level_info, mid, s_face, uname} = data['data'];
        this.userInfo = {coins, face, level_info, mid, s_face, uname};
        this.islogin = true;

        $('.bp-notLogin').addClass('hidden');
        $('.bp-profile').removeClass('hidden');
        // insert userinfo into element
        let avatar = $('.bp-profile-avatar')
        avatar.$('img').src = face;
        avatar.$('span').textContent = uname;
      }
    })

    if (this.islogin) {
      // get video
      const vedioApi = 'http://data.bilibili.com/v/web/web_feed';
      let vedioApiParam = {
        mid: this.cookie.DedeUserID,
        fts: this.cookie.fts,
        url: 'http%3A%2F%2Fwww.bilibili.com%2Faccount%2Fdynamic',
        proid: 1,
        ptype: 1,
        optype: 1,
        tag_content: '',
        tab_type: '',
        tab_content: '',
        _: Date.parse(new Date())
      }

      document.addEventListener('click', e => {
        if (e.target.className === 'bp-tag') {
          vedioApiParam['clickid'] = e.target.getAttribute("name");
          this.bg.fetchData(vedioApi, data => {
            console.log(data)
          }, vedioApiParam, false);
        }
      })
    }
  }

  login () {
    chrome.tabs.create({url: "https://passport.bilibili.com/login"});
  }

  refresh () {
    let fragment = new DocumentFragment()
  }
}

window.$ = Element.prototype.$ = ele => document.querySelector(ele);
$.getAll = ele => document.querySelectorAll(ele);

Element.prototype.addClass = function (className) {
  this.classList.add(className);
  return this;
}
Element.prototype.removeClass = function (className) {
  this.classList.remove(className);
  return this;
}

let start = new BilibiliPlugin()
start.getStorage.then(state => start.init(state))