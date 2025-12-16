import { FFmpeg } from "/ffmpeg/ffmpeg-wasm/index.js";
import JSZip from "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";

const fileInput = document.getElementById("file");
const tracksInput = document.getElementById("tracks");
const processBtn = document.getElementById("process");
const status = document.getElementById("status");

const ffmpeg = new FFmpeg({ log: false });

async function loadFFmpeg() {
  if (ffmpeg.loaded) return;

  status.innerText = "Carregando FFmpeg (primeira vez pode demorar)...";

  await ffmpeg.load({
    coreURL: "/ffmpeg/ffmpeg-core.js",
    wasmURL: "/ffmpeg/ffmpeg-core.wasm"
  });
}

processBtn.onclick = async () => {
  if (!fileInput.files.length || !tracksInput.value.trim()) {
    alert("Selecione o MP3 e informe as faixas.");
    return;
  }

  processBtn.disabled = true;

  try {
    await loadFFmpeg();

    status.innerText = "Lendo arquivo...";
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
      status.innerText = `Processando: ${tracks[i].name}`;

      const args = tracks[i + 1]
        ? ["-i", "input.mp3", "-ss", tracks[i].time, "-to", tracks[i + 1].time, "-c", "copy", "out.mp3"]
        : ["-i", "input.mp3", "-ss", tracks[i].time, "-c", "copy", "out.mp3"];

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile("out.mp3");
      zip.file(`${tracks[i].name}.mp3`, data.buffer);
    }

    status.innerText = "Gerando ZIP...";
    const blob = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "faixas.zip";
    a.click();

    status.innerText = "Concluído ✅";
  } catch (err) {
    console.error(err);
    alert("Erro ao processar o áudio.");
    status.innerText = "Erro ❌";
  }

  processBtn.disabled = false;
};
