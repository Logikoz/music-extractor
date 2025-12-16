import pt from "./locales/pt.js";
import en from "./locales/en.js";

const languages = { pt, en };
const STORAGE_KEY = "mp3-splitter-lang";

export function getLanguage() {
  return localStorage.getItem(STORAGE_KEY)
    || navigator.language.slice(0, 2)
    || "en";
}

export function setLanguage(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function loadDict(lang) {
  return languages[lang] || en;
}

export function applyTranslations(dict) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.innerText = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) el.placeholder = dict[key];
  });
}
