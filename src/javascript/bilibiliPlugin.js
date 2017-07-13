'use strict';

class BilibiliPlugin {
  constructor () {
    this.data = chrome.extension.getBackgroundPage().data
    this.PROFIX = 'bilibili-plugin-'
    this.cookie = {}
    this.islogin = this.data.userInfo.status
    console.log(this.islogin)

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
    if (!this.islogin) {
      $('.bp-notLogin').removeClass('hidden').addEventListener('click', this.login);
      $('.bp-profile').addClass('hidden');
      return false;
    } else {
      let {coins, face, level_info, mid, s_face, uname} = this.data.userInfo['data'];
      this.userInfo = {coins, face, level_info, mid, s_face, uname};

      $('.bp-notLogin').addClass('hidden');
      $('.bp-profile').removeClass('hidden');
      
      // insert userinfo into element
      let avatar = $('.bp-profile-avatar')
      avatar.$('img').src = face;
      avatar.$('span').textContent = uname;

      // inser video list
      let videoWrap = $('.list_wrap');
      let initWrap = document.createDocumentFragment();

      if ('content' in document.createElement('template')) {
        let template = $('#bp-videoList').content;
        let templateLi = template.querySelector('li').children;

        this.data.videoList.forEach(item => {
          let {aid, ctime, desc, owner, pic, pubdate, stat, state, title, tname} = item.archive;
          
          templateLi[0].querySelector('img').src = pic;
          let up = templateLi[1].querySelector('a.bp-videoList-up');
          up.textContent = owner.name;
          up.href = `//space.bilibili.com/${owner.mid}`;

          let info = templateLi[1].querySelector('.bp-videoList-info a');
          info.textContent = desc;
          info.href = `//www.bilibili.com/video/av${aid}`;
          
          initWrap.appendChild(document.importNode(template, true))
        })

        videoWrap.appendChild(initWrap);
      }
      
    }

    if (this.islogin) {
      // get video
      const videoApi = 'http://api.bilibili.com/x/web-feed/feed';
      let videoApiParam = {
        ps: 10,
        type: 0,
        _: Date.parse(new Date())
      }

      document.addEventListener('click', e => {
        if (e.target.className === 'bp-tag') {
          videoApiParam['clickid'] = e.target.getAttribute("name");
          this.bg.fetchData(videoApi, data => {
          }, videoApiParam, false);
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

window.$ = HTMLCollection.prototype.$ = Element.prototype.$ = ele => document.querySelector(ele);
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