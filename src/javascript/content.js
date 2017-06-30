const PROFIX = 'bilibili-plugin-'

class Preference {
  constructor () {
    this.widescreen = ['宽屏模式', '退出宽屏']
    this.danmaku    = ['关闭弹幕', '打开弹幕']

    this.getStorage = new Promise(resolve => {
      chrome.storage.sync.get(null, val => {
        resolve(val)
      })
    })
    
    this.setState = new Proxy(this, {
      get: (target, name) => name in target ? target[name] : false
    })
  }

  domStatus (ele) {
    return str => (ele.dataset.text || ele.childNodes[0].dataset.text) === str
  }
}



window.addEventListener("load", () => {
  let preference       = new Preference(),
      reg              = new RegExp('http|https://www|bangumi.bilibili.com/video|anime/*'),
      url              = location.href,
      MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
  
  if (reg.test(url)) {
    
    let iframe = document.querySelector('iframe'),
        // if there is an iframe which contain video in anime page
        _document = iframe ? iframe.contentWindow.document : document,
        // control button list
        childNodes  = _document
                      .querySelector('.bilibili-player-video-control')
                      .querySelectorAll('.bilibili-player-video-btn'),
        classProfix = 'bilibili-player-video-btn-',
        video       = _document.querySelector('.bilibili-player-video'),
        // observer for video
        config      = { childList: true },
        observer;

    preference.getStorage.then(state => {
      let init = () => {
        video = video.childNodes[0]

        video.addEventListener('loadeddata', () => {
          let eles = []

          Array.from(childNodes).forEach((ele, index) => {
            let eleItem  = ele.classList[1],
                eleClass = eleItem.replace(classProfix, ''),
                name     = preference[eleClass];

            if (eleItem && name) {
              if (preference.domStatus(ele)(name[0]) && state[PROFIX + eleClass]) eles.push({ele: ele, name: name})
            }
          })

          let actions = eles.map(v => new Promise(resolve => {
            v.ele.click()
            if (preference.domStatus(v.ele)(v.name[1])) {
              resolve()
            }
          }))

          Promise.all(actions).then(() => {
            if (state[PROFIX + 'start']) {
              let startBtn = _document.querySelector(`.${classProfix}start`)
              if (startBtn.classList.contains('video-state-pause')) {
                setTimeout(video.play(), 1000)
              }
            }
          })
        })// end of loadeddata
      }

      // if video be loaded
      if (video.childNodes[0]) init()
      else {
        observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
              init()
            }
          })// end of mutations
        });
      }

      if (observer) observer.observe(video, config)
    })
  }
});

fetch('http://space.bilibili.com/ajax/member/MyInfo', {
      'credentials': 'include'
    }).then(res => {
      return res.json()
    }).then(data => console.log(data))