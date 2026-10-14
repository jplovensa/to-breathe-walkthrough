import { chapters, ids, styles } from "./data.js";
import { publicAsset } from "./assets.js";
import {
  createBrief,
  loadState,
  persistState,
  selectVilla,
  MAX_NOTES_LENGTH,
} from "./state.js";
import { initializeMedia } from "./media.js";
import { renderChapter } from "./views.js";

document.querySelectorAll("[data-catalogue]").forEach((link) => {
  link.href = publicAsset("catalogue.pdf");
});

let state = loadState();
const browsingStyle = {};
let step = chapterFromHash();
let toastTimer;
const content = document.querySelector("#content");
const chapterNavigation = document.querySelector("#chapters");
const dialog = document.querySelector("#source-dialog");
const fullscreenButton = document.querySelector("#fullscreen");

function chapterFromHash() {
  return Math.max(0, ids.indexOf(location.hash.slice(1)));
}

function toast(message) {
  const status = document.querySelector("#toast");
  status.textContent = message;
  status.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => status.classList.remove("show"), 2300);
}

function saveSelection() {
  if (!persistState(state))
    toast(
      "Selections are kept for this session; browser storage is unavailable.",
    );
}

function render() {
  content.innerHTML = renderChapter(step, state, browsingStyle);
  initializeMedia(content);
  chapterNavigation.innerHTML = chapters
    .map(
      (name, index) => `
    <button data-go="${index}" ${index === step ? 'aria-current="step"' : ""}>
      <span>0${index + 1}</span>${name}
    </button>`,
    )
    .join("");
  document.querySelector("#counter").textContent =
    `0${step + 1} / ${String(chapters.length).padStart(2, "0")}`;
  document.querySelector("#previous").disabled = step === 0;
  document.querySelector("#next").disabled = step === chapters.length - 1;
  document.querySelector("#progress").style.width =
    `${((step + 1) / chapters.length) * 100}%`;
}

function go(index) {
  if (!Number.isInteger(index)) return;
  step = Math.max(0, Math.min(chapters.length - 1, index));
  history.replaceState(null, "", `#${ids[step]}`);
  render();
  window.scrollTo(0, 0);
  content.focus({ preventScroll: true });
}

function showSource(page) {
  if (!Number.isInteger(page) || page < 1 || page > 23) return;
  const image = document.querySelector("#source-image");
  image.hidden = false;
  image.parentElement.querySelector(".media-status")?.remove();
  delete image.dataset.fallbackTried;
  image.src = publicAsset(`assets/page-${page}.webp`);
  image.alt = `Original Signature Series catalogue, page ${page}`;
  document.querySelector("#source-caption").textContent =
    `SIGNATURE SERIES / PAGE ${page} OF 23`;
  dialog.showModal();
}

function exportBrief() {
  const url = URL.createObjectURL(
    new Blob([createBrief(state)], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "To-Breathe-Client-Brief.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Your client brief has been downloaded");
}

function handleClick(event) {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  const {
    go: chapter,
    source,
    villa,
    finish,
    style,
    shortlist,
  } = button.dataset;

  if (button.hasAttribute("data-watch-film")) {
    go(ids.indexOf("film"));
    const video = document.querySelector("#walkthrough-video");
    video.play().catch(() => toast("Press play to start the film"));
    return;
  }
  if (button.dataset.chapter) return go(ids.indexOf(button.dataset.chapter));
  if (button.dataset.videoTime !== undefined) {
    const video = document.querySelector("#walkthrough-video");
    const seek = () => {
      video.currentTime = Number(button.dataset.videoTime);
      video.play().catch(() => toast("Press play to continue the film"));
    };
    if (video.readyState >= 1) seek();
    else video.addEventListener("loadedmetadata", seek, { once: true });
    return;
  }
  if (chapter !== undefined) return go(Number(chapter));
  if (source) return showSource(Number(source));
  if (villa) {
    state = selectVilla(state, villa);
    saveSelection();
    return render();
  }
  if (finish === "warm" || finish === "white") {
    state.finish = finish;
    saveSelection();
    return render();
  }
  if (style && styles[state.villa].some((option) => option.name === style)) {
    browsingStyle[state.villa] = style;
    return render();
  }
  if (
    shortlist &&
    styles[state.villa].some((option) => option.name === shortlist)
  ) {
    state.style = shortlist;
    if (persistState(state)) toast("Interior direction saved to your vision");
    else
      toast(
        "Interior direction selected for this session; browser storage is unavailable.",
      );
    return render();
  }
  switch (button.id) {
    case "previous":
      return go(step - 1);
    case "next":
      return go(step + 1);
    case "close-source":
      return dialog.close();
    case "print":
      return window.print();
    case "export":
      return exportBrief();
  }
}

document.addEventListener("click", handleClick);
document.addEventListener("input", (event) => {
  if (event.target.id !== "notes") return;
  state.notes = event.target.value.slice(0, MAX_NOTES_LENGTH);
  persistState(state);
});
document.addEventListener("keydown", (event) => {
  const focusedElement = document.activeElement;
  if (
    dialog.open ||
    focusedElement.closest("video") ||
    focusedElement.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(
      focusedElement.tagName,
    ) ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey
  )
    return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    go(step + (event.key === "ArrowRight" ? 1 : -1));
  }
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
fullscreenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    toast("Use your browser’s fullscreen option to present");
  }
});
document.addEventListener("fullscreenchange", () => {
  const presenting = Boolean(document.fullscreenElement);
  fullscreenButton.innerHTML = `${presenting ? "Exit presentation" : "Present"} <span aria-hidden="true">↗</span>`;
  fullscreenButton.setAttribute(
    "aria-label",
    presenting ? "Exit fullscreen" : "Enter fullscreen",
  );
});
window.addEventListener("hashchange", () => go(chapterFromHash()));
render();
