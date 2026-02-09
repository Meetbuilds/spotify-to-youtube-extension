chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "process_songs") {
    
    console.log(`Starting batch. Processing ${message.songs.length} songs.`);

    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError) return;

      let currentIndex = message.globalStartIndex; // Keep track of the real index

      for (const song of message.songs) {
        console.log(`[Song #${currentIndex}] Processing: ${song}`);
        
        try {
          // SEARCH (Cost: 100 units)
          const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(song)}&type=video&maxResults=1`;
          const searchRes = await fetch(searchUrl, { headers: { Authorization: `Bearer ${token}` } });
          
          if (!searchRes.ok) {
             console.error(`CRITICAL ERROR at Song #${currentIndex}:`, await searchRes.text());
             break; // STOP THE LOOP if quota dies
          }

          const searchData = await searchRes.json();
          if (searchData.items && searchData.items.length > 0) {
            const videoId = searchData.items[0].id.videoId;

            // ADD (Cost: 50 units)
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
        
        currentIndex++; // Increment counter
      }
      console.log("Batch complete or stopped.");
    });
  }
});
