document.getElementById("transferBtn").addEventListener("click", async () => {
  const playlistId = document.getElementById("ytPlaylistId").value;
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
        // Slice the array based on the start index
        const songs processes = response.songs.slice(startIndex);
        
        document.getElementById("status").innerText = `Found ${response.songs.length} songs.\nProcessing ${songs.length} songs (starting from #${startIndex})...`;
        
        chrome.runtime.sendMessage({
          action: "process_songs",
          songs: songs,
          playlistId: playlistId,
          globalStartIndex: startIndex // Just for logging
        });
      }
    });
  });
});
