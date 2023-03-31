
import browser from 'webextension-polyfill';



console.log('Content script loaded');


function inject(time) {
    document.getElementById("movie_player").seekTo(time);
}





browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Message received:', message);
    if (message.action === 'seekTo') {

        document.documentElement.setAttribute('onreset', "(" + inject + ")("+message.time+")");
        document.documentElement.dispatchEvent(new CustomEvent('reset'));
        document.documentElement.removeAttribute('onreset');

        console.log('Seeking to time...:',message.time );

    }
});