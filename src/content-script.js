import browser from 'webextension-polyfill';

var today = new Date();
var time = today.getHours() + ":" + today;

console.log('Content script loaded', time);


function inject(time) {
    document.getElementById("movie_player").seekTo(time);
}


browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    console.log('Message received:', message);
    // on url change reload the subtitles : 
    if (message.action == "urlChanged") {
        let subtitles = await fetch(await getCaptionTracks(message.url));
        let res = await subtitles.json();
        browser.storage.local.set({ 'subtitles': JSON.stringify(res) });
    }
    // on seek event seek to value : 
    else if (message.action === 'seekTo') {

        document.documentElement.setAttribute('onreset', "(" + inject + ")(" + message.time / 1000 + ")");
        document.documentElement.dispatchEvent(new CustomEvent('reset'));
        document.documentElement.removeAttribute('onreset');

        console.log('Seeking to time...:', message.time);

    }
});


//Get the link  of the json subtitles data : 
async function getCaptionTracks(url) {
    let res = await fetch(url);
    let html = await res.text();

    if (html.indexOf('captionTracks') === -1) {
        return [];
    }

    let startIdx = html.indexOf('captionTracks');
    startIdx = html.indexOf('[', startIdx);

    let curIdx = startIdx + 1;
    let depth = 1;
    while (depth != 0) {
        let curChar = html[curIdx];
        if (curChar == '[') depth += 1;
        else if (curChar == ']') depth -= 1;
        curIdx += 1;
    }
    let caption_tracks_json = html.substring(startIdx, curIdx);
    let result = JSON.parse(caption_tracks_json);
    return result[0].baseUrl + '&fmt=json3&xorb=2&xobt=3&xovt=3';
}

