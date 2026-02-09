document.getElementById("transferBtn").addEventListener("click", async () => {
  const playlistId = document.getElementById("ytPlaylistId").value;
  // Get start index, default to 0 if empty
  const startIndex = parseInt(document.getElementById("startIndex").value) || 0;

  if (!playlistId) {
    document.getElementById("status").innerText = "Please enter a Playlist ID";
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  }, () => {
    chrome.tabs.sendMessage(tab.id, { action: "scrape_spotify" }, (response) => {
      if (response && response.songs) {
        const allSongs = response.songs;
        // Slice the array to start from the specific index
        const songsToProcess = allSongs.slice(startIndex);
        
        document.getElementById("status").innerText = `Found ${allSongs.length} songs.\nProcessing ${songsToProcess.length} songs (starting from #${startIndex})...`;
        
        chrome.runtime.sendMessage({
          action: "process_songs",
          songs: songsToProcess,
          playlistId: playlistId,
          globalStartIndex: startIndex 
        });
      } else {
        document.getElementById("status").innerText = "No songs found. Scroll down the playlist to load more rows!";
      }
    });
  });
});
