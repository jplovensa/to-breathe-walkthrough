import { publicAsset } from "./assets.js";
import { filmChapters } from "./film-data.js";

// A missing close-up can still show its original catalogue board. If both fail,
// keep a readable status instead of exposing a broken-image icon.
document.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    if (image.dataset.fallback && !image.dataset.fallbackTried) {
      image.dataset.fallbackTried = "true";
      image.src = publicAsset(image.dataset.fallback);
      return;
    }
    image.hidden = true;
    if (image.parentElement.querySelector(".media-status")) return;
    const status = document.createElement("p");
    status.className = "media-status";
    status.setAttribute("role", "status");
    status.textContent =
      "This image could not load. The original catalogue remains available from the catalogue link.";
    image.insertAdjacentElement("afterend", status);
  },
  true,
);

export function initializeMedia(root) {
  const video = root.querySelector("#walkthrough-video");
  if (!video) return;
  const buttons = [...root.querySelectorAll("[data-video-time]")];
  video.addEventListener("timeupdate", () => {
    const index = filmChapters.findLastIndex(
      (chapter) => chapter.start <= video.currentTime,
    );
    buttons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  });
  const showError = () => {
    root.querySelector("#film-error").hidden = false;
  };
  video.addEventListener("error", showError);
  video.querySelector("source").addEventListener("error", showError);
}
