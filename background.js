let isProcessing = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // STOP COMMAND
  if (message.action === "stop_process") {
    isProcessing = false;
    console.log("Stop command received.");
    return;
  }

  // START PROCESS
  if (message.action === "process_songs") {
    isProcessing = true;
    console.log(`Starting batch. Processing ${message.songs.length} songs.`);

    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      let currentIndex = message.globalStartIndex;

      for (const song of message.songs) {
        // CHECK STOP FLAG
        if (!isProcessing) {
          console.log("Process stopped by user.");
          break;
        }

        console.log(`[Song #${currentIndex}] Processing: ${song}`);
        
        try {
          // SEARCH
          const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(song)}&type=video&maxResults=1`;
          const searchRes = await fetch(searchUrl, { headers: { Authorization: `Bearer ${token}` } });
          
          if (!searchRes.ok) {
             console.error(`CRITICAL ERROR at Song #${currentIndex}:`, await searchRes.text());
             break; 
          }

          const searchData = await searchRes.json();
          if (searchData.items && searchData.items.length > 0) {
            const videoId = searchData.items[0].id.videoId;

            // ADD
            const addUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`;
            const body = {
              snippet: {
                playlistId: message.playlistId,
                resourceId: { kind: "youtube#video", videoId: videoId }
              }
            };

            await fetch(addUrl, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            console.log(`[Song #${currentIndex}] Success.`);
          } else {
            console.warn(`[Song #${currentIndex}] No results found.`);
          }

        } catch (e) {
          console.error(`[Song #${currentIndex}] Network Error`, e);
        }
        
        currentIndex++; 
      }
      
      console.log("Batch complete or stopped.");
      isProcessing = false;
    });
  }
});
