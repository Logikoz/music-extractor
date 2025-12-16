import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * =========================
 * CORS CONFIG
 * =========================
 */
if (NODE_ENV !== "production") {
  app.use(cors());
} else {
  app.use(
    cors({
      origin: [
        "https://music-splitter.logikoz.net"
      ],
      methods: ["POST"],
    })
  );
}

app.use(express.json());

/**
 * =========================
 * TMP DIR
 * =========================
 */
const TMP_DIR = "./tmp";
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR);
}

/**
 * =========================
 * ROUTES
 * =========================
 */
app.post("/youtube", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "YouTube URL is required" });
  }

  const output = path.join(TMP_DIR, `youtube-${Date.now()}.mp3`);

  const command = `yt-dlp \
    -f bestaudio \
    --extract-audio \
    --audio-format mp3 \
    -o "${output}" \
    "${url}"`;

  exec(command, (err) => {
    if (err) {
      console.error("yt-dlp error:", err);
      return res.status(500).json({ error: "Failed to download audio" });
    }

    res.download(output, "youtube.mp3", () => {
      fs.unlink(output, () => {});
    });
  });
});

/**
 * =========================
 * START
 * =========================
 */
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🌎 Environment: ${NODE_ENV}`);
});
