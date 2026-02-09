// Listener for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape_spotify") {
    const songs = [];
    // Selects rows in the playlist
    const rows = document.querySelectorAll('[data-testid="tracklist-row"]');

    rows.forEach(row => {
      // Scrape Title and Artist
      const titleElement = row.querySelector('div[dir="auto"]');
      const artistElement = row.querySelector('a[href*="/artist/"]');
      
      if (titleElement && artistElement) {
        const songText = `${titleElement.innerText} ${artistElement.innerText}`;
        songs.push(songText);
      }
    });

    sendResponse({ songs: songs });
  }
});
