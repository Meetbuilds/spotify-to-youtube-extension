# Spotify to YouTube Playlist Transfer 🎵 ➡️ 📺

A Chrome Extension that automates the process of moving your Spotify playlists to YouTube. It scrapes song metadata from your currently active Spotify tab, searches for the best match on YouTube, and adds it to a specified YouTube playlist.

![Extension Preview](https://via.placeholder.com/600x400?text=Spotify+to+YouTube+Extension+Preview)

## ✨ Features

* **Smart Scraping:** Deeply integrates with Spotify's Web UI to extract accurate song titles and artist names.
* **Automated Transfer:** Uses the YouTube Data API v3 to search and add videos automatically.
* **Batch Control:**
    * **Start Index:** Resume transfers from a specific song number (useful if you hit daily limits).
    * **Stop Button:** Pause/Halt the process at any time without reloading the extension.
* **Privacy Focused:** Runs entirely in your browser. No data is sent to third-party servers (other than Google's official APIs).

## 🚀 Prerequisites

1.  **Google Chrome** (or any Chromium-based browser like Brave or Edge).
2.  A **Google Cloud Account** (free) to generate your own API keys.
3.  **Git** (optional, you can just download the ZIP).

---

## 🛠️ Installation & Setup

Because this tool uses sensitive YouTube API scopes ("Manage your YouTube account"), **you must host your own instance** with your own credentials. Follow these steps:

### Phase 1: Get the Code
```bash
git clone [https://github.com/YOUR_USERNAME/spotify-to-youtube-extension.git](https://github.com/YOUR_USERNAME/spotify-to-youtube-extension.git)
cd spotify-to-youtube-extension


