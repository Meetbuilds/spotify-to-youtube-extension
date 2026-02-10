# Spotify to YouTube Playlist Transfer 

- A Chrome Extension that automates the process of moving your Spotify playlists to YouTube. It scrapes song metadata from your currently active Spotify tab, searches for the best match on YouTube, and adds it to a specified YouTube playlist.
- Created using Google Gemini 3 Pro


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
```

### Phase 2: Google Cloud Configuration

**You need a "Client ID" to let Google know this extension belongs to you.**

**1. Go to the Google Cloud Console.**

**2. Create a Project:** Click the dropdown in the top-left -> New Project -> Name it "Spotify-Transfer".

**3. Enable API:**
 - Go to APIs & Services > Library.
 - Search for "YouTube Data API v3".
 - Click Enable.

**4. Configure Consent Screen:**
 - Go to APIs & Services > OAuth consent screen.
 - Select External -> Create.
 - Fill in "App Name" and "Support Email".
 - **IMPORTANT**: Under "Test Users", add your own Google email address. (This allows you to use the app without Google verification).

**5. Create Credentials (Part 1):**
 - Go to APIs & Services > Credentials.
 - Click Create Credentials > OAuth Client ID.
 - Select Application Type: Chrome Extension.
 - Pause here. You need the "Item ID" from Chrome

### Phase 3: Load into Chrome & Get ID

**1.** Open Chrome and go to chrome://extensions/.
**2.** Toggle Developer mode (top right corner).
**3.** Click Load unpacked.
**4.** Select the folder where you downloaded this code.
**5.** Copy the ID: Look for the ID string on the extension card (e.g., mpd...). Copy it.

### Phase 4: Finalize & Connect
**1. Finish Cloud Setup:**
 - Go back to the Google Cloud tab.
 - Paste the Chrome Extension ID into the Item ID field.
 - Click Create.
 - Copy the "Client ID" string it generates.

**2. Update Your Code:**
 - Open manifest.json in a text editor (Notepad, VS Code, etc.).
 - Replace YOUR_CLIENT_ID_HERE with the Client ID you just copied.
 - (Optional) Add "key": "YOUR_EXTENSION_PUBLIC_KEY" if you want to make the installation permanent across machines.

**3. Reload:** Go back to chrome://extensions/ and click the 🔄 (Refresh) icon on your extension.


### 📖 How to Use

**1. Open Spotify:**
 - Log in to Spotify Web Player (open.spotify.com).
 - Open the playlist you want to transfer.
 - Crucial Step: Scroll down to the bottom of the playlist to ensure all songs are loaded (Spotify "lazy loads" tracks).

**2. Prepare YouTube:**
 - Create a new playlist on YouTube (set it to Public or Unlisted).
 - Copy the Playlist ID from the URL (the text after &list=).
 - Example URL: youtube.com/playlist?list=PLsahGe7yxYZ... -> ID is PLsahGe7yxYZ...

**3. Run the Transfer:**
 - Click the extension icon in Chrome.
 - Paste the YouTube Playlist ID.
 - (Optional) Set Start Index to 0.
 - Click Start Transfer.

**4. Authorize:**
 - A Google popup will appear.
 - Check the box: "Manage your YouTube account" (Required to add videos).
 - Click Continue.

**5. Monitor:**
 - The popup will show "Processing...".
 - To see real-time logs, click the "service worker" link in chrome://extensions.


### 🛑 Controls

 - **Start Transfer**: Begins the process from the specified "Start Index".
 - **Stop**: Safely halts the process after the current song is finished.
 - **Start Index**: If the process stops at song #50 (due to limits or errors), type 50 here next time to resume without re-doing the first 49.

### ⚠️ Important Limitations (Quota)

**The YouTube Data API (Free Tier) has a daily limit of 10,000 units.**
 - **Search Cost**: 100 units
 - **Add to Playlist Cost**: 50 units
 - **Total Cost per Song**: 150 units
**Max songs per day**: ~66 songs. If you hit the limit (Error 403), wait until Midnight (Pacific Time) for the quota to reset.

#### 🤝 Contributing
**Pull requests are welcome!**

Fork the Project
 - Create your Feature Branch (git checkout -b feature/AmazingFeature)
 - Commit your Changes (git commit -m 'Add some AmazingFeature')
 - Push to the Branch (git push origin feature/AmazingFeature)
 - Open a Pull Request
