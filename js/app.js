import { FFmpeg } from "/ffmpeg/ffmpeg-wasm/index.js";
import JSZip from "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";
import { getLanguage, setLanguage, loadDict, applyTranslations } from "./i18n.js";

const langSelect = document.getElementById("language");

let currentLang = getLanguage();
langSelect.value = currentLang;

let lang = loadDict(currentLang);
applyTranslations(lang);

langSelect.onchange = () => {
    currentLang = langSelect.value;
    setLanguage(currentLang);
    lang = loadDict(currentLang);
    applyTranslations(lang);
};

const progressBar = document.getElementById("progress-bar");

const fileInput = document.getElementById("file");
const tracksInput = document.getElementById("tracks");
const processBtn = document.getElementById("process");
const status = document.getElementById("status");

const ffmpeg = new FFmpeg({ log: false });

const TIME_REGEX = /^\d{1,2}:\d{2}$/;

async function loadFFmpeg() {
    if (ffmpeg.loaded) return;

    status.innerText = lang.status_loading;

    await ffmpeg.load({
        coreURL: "/ffmpeg/ffmpeg-core.js",
        wasmURL: "/ffmpeg/ffmpeg-core.wasm"
    });
}

/**
 * Parse line:
 * MM:SS - Title - Artist
 */
function parseLine(line) {
    const parts = line.split(" - ");

    if (parts.length < 3) return null;

    const time = parts[0].trim();
    const artist = parts.pop().trim();
    const title = parts.slice(1).join(" - ").trim();

    if (!TIME_REGEX.test(time)) return null;

    return { time, title, artist };
}

processBtn.onclick = async () => {
    if (!fileInput.files.length || !tracksInput.value.trim()) {
        alert(lang.error_missing);
        return;
    }

    processBtn.disabled = true;

    try {
        await loadFFmpeg();

        status.innerText = lang.reading_file;

        await ffmpeg.writeFile(
            "input.mp3",
            new Uint8Array(await fileInput.files[0].arrayBuffer())
        );

        const lines = tracksInput.value
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

        const tracks = lines
            .map(parseLine)
            .filter(Boolean);

        if (!tracks.length) {
            alert(lang.error_processing);
            processBtn.disabled = false;
            return;
        }

        const zip = new JSZip();

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const next = tracks[i + 1];

            status.innerText = `${lang.prossessing} ${track.title}`;

            const percent = Math.round((i / tracks.length) * 100);
            progressBar.style.width = percent + "%";

            const safeTitle = track.title.replace(/[\\/:*?"<>|]/g, "");
            const safeArtist = track.artist.replace(/[\\/:*?"<>|]/g, "");

            const args = [
                "-i", "input.mp3",
                "-ss", track.time,
                ...(next ? ["-to", next.time] : []),

                // 🔹 METADADOS ID3
                "-metadata", `title=${track.title}`,
                "-metadata", `artist=${track.artist}`,

                // 🔹 Limpa metadados antigos e re-encoda
                "-map_metadata", "-1",
                "-vn",
                "-acodec", "libmp3lame",

                "out.mp3"
            ];

            await ffmpeg.exec(args);

            const data = await ffmpeg.readFile("out.mp3");

            zip.file(
                `${safeTitle} - ${safeArtist}.mp3`,
                data.buffer
            );
        }

        progressBar.style.width = "100%";

        status.innerText = lang.generating_zip;

        const blob = await zip.generateAsync({ type: "blob" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = lang.file_name;
        a.click();

        status.innerText = lang.status_done;
    } catch (err) {
        console.error(err);
        alert(lang.error_processing);
        status.innerText = "Error ❌";
    }

    processBtn.disabled = false;
};
