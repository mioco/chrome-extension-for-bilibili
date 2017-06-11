let profix = 'bilibili-plugin'
function Prefrence () {
  this.isWidescreen = true
  this.isFullscreen = this.getItem('fullscreen')
  this.isDanmaku = this.getItem('danmaku')
  this.isStart = true
}

Prefrence.prototype.getItem = name => {
  return localStorage.getItem(profix + name) || false
}

Prefrence.prototype.promiseFactory = fun => {
  return new Promise((resolve, reject) => {
    resolve(fun())
  })
}

Prefrence.prototype.start = ele => ele.classList.contains('video-state-pause') && this.isStart
Prefrence.prototype.widescreen = ele => ele.childNodes[0].dataset.text === '宽屏模式' && this.isWidescreen
Prefrence.prototype.fullscreen = ele => ele.childNodes[0].dataset.text === '进入全屏' && this.isFullscreen
Prefrence.prototype.danmaku = ele => ele.childNodes[0].dataset.text === '关闭弹幕' && this.isDanmaku

window.addEventListener("load", () => {
  let prefrence = new Prefrence(),
      reg = new RegExp('www.bilibili.com/video|anime/*'),
      url = location.host + location.pathname,
      MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  if (reg.test(url)) {
    console.log('is start')
    let childNodes = document.querySelector('.bilibili-player-video-control').childNodes,
        classProfix = 'bilibili-player-video-btn-',
        video = document.querySelector('.bilibili-player-video'),
        config = { childList: true },

        observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
              video = document.querySelector('.bilibili-player-video').childNodes[0]
              
              video.addEventListener('loadeddata', () => {
                Array.from(childNodes).forEach(ele => {
                  let eleItem = ele.classList[1]

                  if(eleItem && prefrence[eleItem.replace(classProfix, '')]) {
                    // if (prefrence[](ele)) ele.click()
                  }
                });
              })
            }
          })
        })
    ; // variable
    
    observer.observe(video, config)
  }
});