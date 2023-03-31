import browser from "webextension-polyfill";


  browser.runtime.onMessage.addListener(async (message, sender) => {
    // Send a message to the content script in the target tab

    const tab = await browser.tabs.query({ active: true, currentWindow: true });
    browser.tabs.sendMessage(tab[0].id, { action: 'seekTo', time: message });
  });
