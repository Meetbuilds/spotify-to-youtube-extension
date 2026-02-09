chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape_spotify") {
    const songs = [];
    
    // Select every row in the visible playlist
    const rows = document.querySelectorAll('[data-testid="tracklist-row"]');

    rows.forEach(row => {
      // 1. Get Title: Look for the internal link (usually the title)
      // Fallback to div[dir="auto"] if the link isn't found
      const titleEl = row.querySelector('a[data-testid="internal-track-link"]') || row.querySelector('div[dir="auto"]');
      
      // 2. Get Artist: Look for all artist links
      const artistEls = row.querySelectorAll('a[href*="/artist/"]');
      
      if (titleEl && artistEls.length > 0) {
        // Combine title + first artist (e.g., "Shape of You Ed Sheeran")
        // We use the first artist to keep the search precise
        const songText = `${titleEl.innerText} ${artistEls[0].innerText}`;
        songs.push(songText);
      }
    });

    console.log(`Scraped ${songs.length} songs.`);
    sendResponse({ songs: songs });
  }
});
