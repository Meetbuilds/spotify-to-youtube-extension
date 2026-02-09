const transferBtn = document.getElementById("transferBtn");
const stopBtn = document.getElementById("stopBtn");
const statusDiv = document.getElementById("status");

// Start Transfer
transferBtn.addEventListener("click", async () => {
  const playlistId = document.getElementById("ytPlaylistId").value;
  const startIndex = parseInt(document.getElementById("startIndex").value) || 0;

  if (!playlistId) {
    statusDiv.innerText = "Please enter a Playlist ID";
    return;
  }

  // UI Updates
  transferBtn.disabled = true;
  stopBtn.disabled = false;
  statusDiv.innerText = "Initializing...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  }, () => {
    chrome.tabs.sendMessage(tab.id, { action: "scrape_spotify" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        statusDiv.innerText = "Error: Could not connect to Spotify tab. Refresh the page.";
        transferBtn.disabled = false;
        stopBtn.disabled = true;
        return;
      }

      if (response.songs) {
        const allSongs = response.songs;
        const songsToProcess = allSongs.slice(startIndex);
        
        statusDiv.innerText = `Found ${allSongs.length} songs.\nProcessing ${songsToProcess.length} songs (starting from #${startIndex})...`;
        
        chrome.runtime.sendMessage({
          action: "process_songs",
          songs: songsToProcess,
          playlistId: playlistId,
          globalStartIndex: startIndex 
        });
      } else {
        statusDiv.innerText = "No songs found. Scroll down the playlist to load more rows!";
        transferBtn.disabled = false;
        stopBtn.disabled = true;
      }
    });
  });
});

// Stop Transfer
stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stop_process" });
  statusDiv.innerText += "\n[STOP REQUESTED] Stopping after current song...";
  transferBtn.disabled = false;
  stopBtn.disabled = true;
});

// Listen for updates from background to update UI (optional but good for UX)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "update_status") {
    statusDiv.innerText = msg.text;
    if (msg.done) {
      transferBtn.disabled = false;
      stopBtn.disabled = true;
    }
  }
});
