function reddenPage() {
  // const link = document.createElement('link')
  // link.setAttribute('href', 'style.css')
  // document.head.appendChild(link)
  // document.body.style.backgroundColor = 'red';
  chrome.scripting.insertCSS({
    css: {
      files: ['style.css']
    }
  })
}

async function getCurrentTab() {
  let queryOptions = {active: true, lastFocusedWindow: true};
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  // if (tab.id){
  //   await chrome.tabs.remove(tab.id, function (){
  //     console.log('shanchu chenggong ')
  //   })
  // }
  // return tab;
}

chrome.tabs.onActivated.addListener(changeStyle);
chrome.tabs.onUpdated.addListener(changeStyle);

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id}, function: reddenPage
    });

    chrome.scripting.insertCSS({
      target: {tabId: tab.id}, files: ['style.css']
    })
  }
});

chrome.runtime.onInstalled.addListener(async () => {

  // While we could have used `let url = "hello.html"`, using runtime.getURL is a bit more robust as
  // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
  // runtime.
  let url = chrome.runtime.getURL("hello.html");
  //
  // Open a new tab pointing at our page's URL using JavaScript's object initializer shorthand.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#new_notations_in_ecmascript_2015
  //
  // Many of the extension platform's APIs are asynchronous and can either take a callback argument
  // or return a promise. Since we're inside an async function, we can await the resolution of the
  // promise returned by the tabs.create call. See the following link for more info on async/await.
  // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
  let tab2 = await chrome.tabs.create({ url });

  // Finally, let's log the ID of the newly created tab using a template literal.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  //
  // To view this log message, open chrome://extensions, find "Hello, World!", and click the
  // "service worker" link in the card to open DevTools.
  // console.log(`Created tab ${tab2.id}`);
  //
  // let queryOptions = {active: true, lastFocusedWindow: true};
  // // `tab` will either be a `tabs.Tab` instance or `undefined`.
  // let [tab] = await chrome.tabs.query(queryOptions);
  // const host = new URL(tab.url).host
  // chrome.storage.sync.get(['host'], function(result) {
  //   console.log('Value currently is ' + result.host);
  //   chrome.scripting.insertCSS({
  //     target: {tabId: tab.id}, css: result.host
  //   })
  // });
});

async function  changeStyle (){
  let queryOptions = {active: true, currentWindow: true};
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  if (tab){
    const host = new URL(tab.url).host
    // debugger
    chrome.storage.sync.get([host], function(result) {
      console.log('Value currently is ' + result[host]);
      chrome.scripting.insertCSS({
        target: {tabId: tab.id}, css: result[host]
      })
    });
  }
}

chrome.windows.onFocusChanged.addListener(
  changeStyle
)

// const tabId = getTabId();
// chrome.scripting.executeScript({
//   target: {tabId: tabId, allFrames: true}, files: ['script.js'],
// });


