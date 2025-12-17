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

async function loadFFmpeg() {
    if (ffmpeg.loaded) return;

    status.innerText = lang.status_loading;

    await ffmpeg.load({
        coreURL: "/ffmpeg/ffmpeg-core.js",
        wasmURL: "/ffmpeg/ffmpeg-core.wasm"
    });
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

        const tracks = lines.map(line => {
            const [time, name] = line.split(" - ");
            return { time, name };
        });

        const zip = new JSZip();

        for (let i = 0; i < tracks.length; i++) {
            status.innerText = `${lang.prossessing} ${tracks[i].name}`;

            const percent = Math.round((i / tracks.length) * 100);
            progressBar.style.width = percent + "%";

            const args = tracks[i + 1]
                ? ["-i", "input.mp3", "-ss", tracks[i].time, "-to", tracks[i + 1].time, "-c", "copy", "out.mp3"]
                : ["-i", "input.mp3", "-ss", tracks[i].time, "-c", "copy", "out.mp3"];

            await ffmpeg.exec(args);

            const data = await ffmpeg.readFile("out.mp3");
            zip.file(`${tracks[i].name}.mp3`, data.buffer);
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
