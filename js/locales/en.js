export default {
  title: "🎵 MP3 Splitter",
  subtitle: "Split a large MP3 file into multiple tracks using timestamps",

  help_title: "📘 How to use",
  help_steps: [
    "Select the original MP3 file",
    "Enter the tracks, one per line",
    "Click Generate ZIP"
  ],

  format_title: "Track format:",
  example_title: "Example:",
  help_note:
    "ℹ️ The time indicates where the track starts. The end is calculated automatically.",

  file_label: "MP3 File",
  tracks_label: "Tracks",
  button: "Generate ZIP",

  status_loading: "Loading FFmpeg (first time may take a while)...",
  status_done: "Completed ✅",
  error_missing: "Please select an MP3 file and enter the tracks.",
  prossessing: "Working: ",
  reading_file: "Reading file...",
  generating_zip: "Generating ZIP...",
  file_name: "tracks.zip",
  error_processing: "Error processing audio."
};
