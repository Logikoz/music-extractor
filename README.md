## 📘 README.md 

# 🎵 MP3 Splitter (FFmpeg.wasm)

This project is a **100% client-side MP3 splitter** that allows you to split a large MP3 file into multiple tracks using timestamps.

All processing happens **locally in the browser** using FFmpeg.wasm.
No files are uploaded to any server.

---
## ✨ Features

- Split MP3 files by timestamps
- Automatic ZIP generation
- Multi-language UI (auto-detect browser language)
- Runs fully in the browser
- Docker & Nginx ready
- No backend required

---

## 🧭 Track Format

Each track must be written on a new line using the following format:

```
MM:SS - Track Name - Author Name
```

### Example:

```
00:01 - Track One - Author Name
03:10 - Track Two - Author Name
06:22 - Track Three - Author Name
````

The start time defines where the track begins.
The end time is calculated automatically based on the next track.

---

## 🚀 Running Locally (without Docker)

You must serve the files using a local HTTP server (ES Modules do not work with file://).

### Using Node.js


```bash
npx http-server .
```



Then open:

```
http://localhost:8080
```

---

## 🐳 Running with Docker (Production Ready)

### Requirements

* Docker
* Docker Compose

### Build and start

```bash
docker compose up --build
```

Open in your browser:

```
http://localhost:8080
```

---

## 📁 Project Structure

```
.
├─ index.html
├─ css/
├─ js/
│  ├─ app.js
│  ├─ i18n.js
│  └─ locales/
├─ ffmpeg/
├─ Dockerfile
├─ docker-compose.yml
└─ nginx.conf
```

---

## 🔐 Privacy

This application does **not upload files**.
All audio processing happens directly in your browser.

---

## 🧪 Tested Browsers

* Chrome
* Firefox
* Edge

---

## 📜 License

MIT
