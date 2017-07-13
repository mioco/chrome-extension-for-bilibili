/**
 * @TODO
 * - 负责对bilibili的所有请求操作
 * 2017-07-12
 */

class WebRequest {
  constructor (config) {
    this.urls = ['*://*.bilibili.com/*'];
    this.config = Object.assign({
      Origin: 'https://www.bilibili.com'
    }, config)
    
    this.requestRules = {
      'Origin': {
        'value': this.config.Origin,
        'mandatory': true
      }
    }

    this.responseRules = {
      'Access-Control-Allow-Origin': {
        'value': '*',
        'mandatory': true
      },
      'Access-Control-Allow-Headers': {
        'value': '*',
        'mandatory': true
      },
      'Access-Control-Allow-Credentials': {
        'value': '*',
        'mandatory': true
      },
    };

    // /*Remove Listeners*/
    // chrome.webRequest.onHeadersReceived.removeListener(responseListener);
    // chrome.webRequest.onBeforeSendHeaders.removeListener(requestListener);

    /*Add Listeners*/
    chrome.webRequest.onHeadersReceived.addListener(this.listener(this.responseRules, 'responseHeaders'), {
      urls: this.urls
    }, ['blocking', 'responseHeaders']);

    chrome.webRequest.onBeforeSendHeaders.addListener(this.listener(this.requestRules, 'requestHeaders'), {
      urls: this.urls
    }, ['blocking', 'requestHeaders']);
  }

  listener (rules, headers) {
    return details => {
      details[headers].forEach(header => {
        let value;
        if (value = rules[header.name]) {
          header.value = value['value'];
          delete rules[header.name];
        }
      })

      if(JSON.stringify(rules).length > 2) {
        Object.keys(rules).forEach(key => {
          details[headers].push({ name: key, value: rules[key]['value']})
        })
      }
      return {[headers]: details[headers]};
    }
  }
}

window.webRequest = config => new WebRequest(config);
