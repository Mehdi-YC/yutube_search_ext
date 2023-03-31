<!-- App.svelte -->
<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

  let subtitles = [];
  let searchTerm = "";
  let filteredList = [];

  // transforms the element segs into one line to display it :
  function get_line(element) {
    try {
      return element.segs.reduce((acc, curr) => acc + curr.utf8, "");
    } catch (error) {
      return false;
    }
  }

  //changes filteted list on searchTerm change , it contatenates all segs and see if the inputed value is contained in there
  $: {
    filteredList = subtitles.filter((item) =>
      item.segs
        ? item.segs
            .reduce((acc, curr) => acc + curr.utf8, "")
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1
        : []
    );
  }

  //gets the subtitles loaded by the content-script
  onMount(async () => {
    const storedData = await browser.storage.local.get("subtitles");
    console.log(storedData);
    if (storedData) {
      subtitles = JSON.parse(storedData.subtitles).events;
      console.log(subtitles);
    }
  });

  function secondsToHms(d) {
    d = Number(d / 1000);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
    if (hDisplay != "") {
      return (
        (hDisplay.length > 1 ? hDisplay : "0" + hDisplay) +
        ":" +
        (mDisplay.length > 1 ? mDisplay : "0" + mDisplay) +
        ":" +
        (sDisplay.length > 1 ? sDisplay : "0" + sDisplay)
      );
    } else if (mDisplay != "") {
      return (
        (mDisplay.length > 1 ? mDisplay : "0" + mDisplay) +
        ":" +
        (sDisplay.length > 1 ? sDisplay : "0" + sDisplay)
      );
    } else if (sDisplay != "") {
      return "00:" + (sDisplay.length > 1 ? sDisplay : "0" + sDisplay);
    }
    return "00:00";
  }
  
</script>

<main>
  <input id="search-term" bind:value={searchTerm} placeholder="Search..." />

  <ul id="subtitles-list">
    {#each filteredList as s}
      {#if get_line(s) != false}
        <li>
          <button on:click={() => browser.runtime.sendMessage(s.tStartMs)}
            >{get_line(s)}</button
          >
          <p>{secondsToHms(s.tStartMs)}</p>
        </li>
      {/if}
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
    padding: 1px;
  }
  button {
    padding: 0 1px;
    background-color: transparent;
    border: none;
  }
</style>
