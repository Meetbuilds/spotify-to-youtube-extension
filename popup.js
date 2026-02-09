document.getElementById("transferBtn").addEventListener("click", async () => {
  const playlistId = document.getElementById("ytPlaylistId").value;
  if (!playlistId) {
    document.getElementById("status").innerText = "Please enter a Playlist ID";
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject content script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  }, () => {
    // Ask content script to scrape
    chrome.tabs.sendMessage(tab.id, { action: "scrape_spotify" }, (response) => {
      if (response && response.songs) {
        document.getElementById("status").innerText = `Found ${response.songs.length} songs. Processing in background...`;
        
        // Send to background
        chrome.runtime.sendMessage({
          action: "process_songs",
          songs: response.songs,
          playlistId: playlistId
        });
      } else {
        document.getElementById("status").innerText = "No songs found. Are you on a Spotify playlist page?";
      }
    });
  });
});
