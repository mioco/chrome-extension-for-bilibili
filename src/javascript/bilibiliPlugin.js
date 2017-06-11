'use strict';

function BilibiliPlugin() {
  this.prefrence = {
    Widescreen: false,
    Fullscreen: false,
    Danmaku: false,
    Start: false
  };

  this.getCurrentTab = function (callback) {
    var queryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
      var tab = tabs[0];
      callback(tab);
    });
  };

  this.getCurrentVideoConf = function () {
    console.log(chrome.tab);
  };

  this.prefrenceConf = function (win) {
    
  };
}