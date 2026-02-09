chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "process_songs") {
    
    // 1. Get Auth Token
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        console.error("Auth Error:", chrome.runtime.lastError);
        return;
      }

      console.log("Token received, starting transfer...");

      for (const song of message.songs) {
        try {
          // 2. Search for the song on YouTube
          const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(song)}&type=video&maxResults=1`;
          const searchRes = await fetch(searchUrl, { headers: { Authorization: `Bearer ${token}` } });
          const searchData = await searchRes.json();

          if (searchData.items && searchData.items.length > 0) {
            const videoId = searchData.items[0].id.videoId;

            // 3. Add to Playlist
            const addUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`;
            const body = {
              snippet: {
                playlistId: message.playlistId,
                resourceId: { kind: "youtube#video", videoId: videoId }
              }
            };

            await fetch(addUrl, {
              method: "POST",
              headers: { 
                Authorization: `Bearer ${token}`, 
                "Content-Type": "application/json" 
              },
              body: JSON.stringify(body)
            });
            console.log(`Added: ${song}`);
          }
        } catch (e) {
          console.error(`Failed to add ${song}`, e);
        }
      }
      console.log("All done!");
    });
  }
});
