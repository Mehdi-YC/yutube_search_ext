<!-- App.svelte -->
<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

  let subtitles = [];
  let searchTerm = "";
  let filteredList = [];

  $: filteredList = subtitles.filter(
    (item) => item.text.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );
  onMount(async () => {
    const tab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const videoId = extractVideoId(tab[0].url);

    await getSubtitles(videoId);
  });

  function extractVideoId(url) {
    const match = url.match(/youtube\.com\/watch\?v=(\w+)/);
    return match ? match[1] : "";
  }

 function  secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
        if (hDisplay != "") {
            return (hDisplay.length > 1 ? hDisplay : '0' + hDisplay) + ":" + (mDisplay.length > 1 ? mDisplay : '0' + mDisplay) + ":" + (sDisplay.length > 1 ? sDisplay : '0' + sDisplay);
        }
        else if (mDisplay != "") {
            return (mDisplay.length > 1 ? mDisplay : '0' + mDisplay) + ":" + (sDisplay.length > 1 ? sDisplay : '0' + sDisplay);
        }
        else if (sDisplay != "") {
            return "00:" + (sDisplay.length > 1 ? sDisplay : '0' + sDisplay);
        }
        return "00:00"
    }
    
  async function getSubtitles(videoId) {
    const response = await fetch(`http://109.123.240.126:8000/${videoId}`);
    subtitles = await response.json();
    console.log(subtitles);
  }
</script>

<main>
  <input id="search-term" bind:value={searchTerm} placeholder="Search..." />

  <ul id="subtitles-list">
    {#each filteredList as s}
      <li>
        <button on:click={() => browser.runtime.sendMessage(s.start)}
          >{s.text}</button
        >
        <p>{secondsToHms(s.start)}</p>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    height: 220px;
    width: 230px;
  }
  #search-term {
    position: sticky;
    border: 0 0 2px 0 rgba(0, 0, 0, 0.349) solid;
    padding-left: 0;
    margin-left: 0; 
  }

  #subtitles-list {
    padding-left: 0;
    margin-left: 0;
    display: block;
    height: 180px;
    overflow-y: scroll;
  }
  li {
    display: flex;
    justify-content: center;
    color: black;
    margin-bottom: 3px;
    text-decoration: none;
    list-style: none;
    border: 1px solid grey;
    border-radius: 8px;
    text-align: center;
  }

  li > p {
    justify-content: center;
    margin-top: 3px;
    margin-bottom: 5px;
    background-color: #777;
    border-radius: 8px;
    width: fit-content;
    padding:1px;

  }
  button {
    padding: 0 1px;
    background-color: transparent;
    border: none;
  }
</style>
