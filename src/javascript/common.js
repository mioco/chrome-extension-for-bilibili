/**
 * 代码参考：https://jasonsavard.com/wiki/Checker_Plus_for_Gmail?ref=GmailChecker
 * @param {string} url 
 */

function openUrl(url) {

	if (!window.inWidget && chrome.tabs) {
    return new Promise((resolve, reject) => {
      new Promise((resolve, reject) => {
        if (navigator.userAgent.indexOf("Firefox") > -1) { // required for Firefox because when inside a popup the tabs.create would open a tab/url inside the popup but we want it to open inside main browser window 
          chrome.windows.getCurrent(thisWindow => {
            if (thisWindow && thisWindow.type == "popup") {
              chrome.windows.getAll({windowTypes:["normal"]}, windows => {
                if (windows.length) {
                  resolve(windows[0].id)
                } else {
                  resolve();
                }
              });
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }		
      }).then(windowId => {
        var createParams = {url: url};
        if (windowId != undefined) {
          createParams.windowId = windowId;
        }
      });
    }).then(response => {
      if (location.href.indexOf("source=toolbar") != -1 && DetectClient.isFirefox() && params.autoClose !== false) {
        window.close();
      }
      resolve();
    });
  } else {
    top.location.href = url;
  }
}