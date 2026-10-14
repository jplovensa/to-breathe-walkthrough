import { styles, villas } from "./data.js";

export const STORAGE_KEY = "to-breathe-vision";
export const MAX_NOTES_LENGTH = 4000;

export function normalizeState(saved) {
  const input = saved && typeof saved === "object" ? saved : {};
  const villa = Object.hasOwn(villas, input.villa) ? input.villa : "shelter";
  return {
    villa,
    finish: input.finish === "white" ? "white" : "warm",
    style: styles[villa].some((option) => option.name === input.style)
      ? input.style
      : null,
    notes:
      typeof input.notes === "string"
        ? input.notes.slice(0, MAX_NOTES_LENGTH)
        : "",
  };
}

export function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    // Storage can be blocked or contain data from an older presentation version.
    return normalizeState();
  }
}

export function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
    return true;
  } catch {
    return false;
  }
}

export function selectVilla(state, villa) {
  if (!Object.hasOwn(villas, villa) || state.villa === villa) return state;
  return { ...state, villa, style: null };
}

export function createBrief(state) {
  const selection = normalizeState(state);
  const villa = villas[selection.villa];
  const exterior =
    selection.villa === "veil" && selection.finish === "white"
      ? "Soft white"
      : "Warm beige";
  return `TO BREATHE — CLIENT DIRECTION
Fjäll Group × SECHA

Architecture: ${villa.name} / FG–Signature ${villa.signature}
Exterior: ${exterior}
Interior: ${selection.style || "Still exploring"}

What matters most
${selection.notes || "To discuss"}

Next conversation
Site and orientation; space requirements; material samples; budget and programme.

Based on the To Breathe Signature Series catalogue. A discussion brief, subject to project-specific design and specification. Pricing, floor plans, and delivery timelines are not specified in the catalogue.
`;
}
