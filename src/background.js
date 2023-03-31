import browser from "webextension-polyfill";

const port = browser.runtime.connect({ name: "svelte-port" });
browser.runtime.onMessage.addListener(async (message, sender) => {
  // Send a message to the content script in the target tab
  if (message.data) {
    console.log("got data")
    console.log(message.data)
    port.postMessage({ data: message.data });
  }
  else {
    const tab = await browser.tabs.query({ active: true, currentWindow: true });
    browser.tabs.sendMessage(tab[0].id, { action: 'seekTo', time: message });
  }




});

browser.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {

    if (changeInfo.url) {
      console.log("URL changed", changeInfo.url)
      browser.tabs.sendMessage(tabId, {
        action: "urlChanged",
        url: changeInfo.url
      })
    }
  }
);





browser.runtime.onMessage.addListener((message) => {

});