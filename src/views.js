import { villas, styles } from "./data.js";
import { filmChapters } from "./film-data.js";
import { publicAsset } from "./assets.js";

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

function sourceButton(page, label = "View catalogue details") {
  return `<button class="text-link" data-source="${page}">${label} <span aria-hidden="true">↗</span></button>`;
}
function label(text) {
  return `<div class="eyebrow">${text}</div>`;
}
function intro(state, browsingStyle) {
  return `<section class="intro chapter"><div class="intro-copy">${label("THE SIGNATURE SERIES / A CLIENT WALKTHROUGH")}<h1>Room to<br><em>breathe.</em></h1><p class="lead">A quieter way to live.<br>Architecture that makes space for you.</p><div class="hero-actions"><button class="primary" data-watch-film>Watch the film <span>↗</span></button><button class="text-link" data-chapter="philosophy">Explore the collection ↗</button></div><div class="intro-credit"><span>Architecture by Fjäll Group</span><span>Interiors by SECHA</span></div></div><div class="intro-image"><img src="${publicAsset(`assets/shelter.webp`)}" data-fallback="assets/page-3.webp" alt="Shelter of Sky villa with sweeping rooflines, garden, and curved canopy"><span class="image-index">01 — SHELTER OF SKY</span><div class="image-note">Light. Air. Presence.</div></div><span class="vertical-caption">TO BREATHE / SIGNATURE COLLECTION</span></section>`;
}
function philosophy(state, browsingStyle) {
  return `<section class="philosophy chapter"><div class="philosophy-photo"><img src="${publicAsset(`assets/veil.webp`)}" data-fallback="assets/page-12.webp" alt="Veil of Light illuminated at dusk"><span class="photo-caption">A soft boundary between shelter and openness.</span></div><div class="philosophy-copy">${label("01 / THE PHILOSOPHY")}<h2>Less noise.<br><em>More presence.</em></h2><p class="lead">Space should support the way you live.</p><p>To Breathe is an exercise in restraint. Form follows light, air, and the landscape. Interiors bring that same quiet language inward, through natural textures and considered transitions.</p><div class="principles"><div><span>01</span><h3>Listen to the landscape</h3><p>Architecture that belongs to its surroundings.</p></div><div><span>02</span><h3>Soften the boundary</h3><p>Inside and outside feel like one continuous experience.</p></div><div><span>03</span><h3>Keep only what matters</h3><p>Calm materials and intentional details give life room.</p></div></div>${sourceButton(2, "Read the project story")}</div></section>`;
}
function architecture(state, browsingStyle) {
  const v = villas[state.villa];
  return `<section class="architecture chapter"><div class="section-heading">${label("02 / CHOOSE YOUR ARCHITECTURE")}<div class="heading-row"><h2>Two expressions.<br><em>One quiet intention.</em></h2><p>Find the form that feels like home.<br>Select a signature to explore its character.</p></div></div><div class="villa-layout"><div class="villa-visual"><img src="${publicAsset(`assets/${v.image}.webp`)}" data-fallback="assets/page-${v.page}.webp" alt="${v.name} architectural rendering"><div class="gallery-links">${sourceButton(v.gallery, "Daylight views")}${sourceButton(v.detail, "Evening views")}</div></div><div class="villa-copy"><div class="segmented" role="group" aria-label="Villa architecture">${Object.entries(
    villas,
  )
    .map(
      ([key, item]) =>
        `<button data-villa="${key}" aria-pressed="${state.villa === key}"><span>${item.signature}</span>${item.name}</button>`,
    )
    .join(
      "",
    )}</div>${label("FG–SIGNATURE " + v.signature)}<h3 class="villa-title">${v.name}</h3><p>${v.description}</p><ul class="attributes">${v.attributes.map((a) => `<li>${a}</li>`).join("")}</ul><div class="construction"><span class="small-label">THE STRUCTURAL APPROACH</span><p>EPS-based construction supports the expressive forms. The catalogue describes a lightweight, efficient, highly insulated approach.</p></div>${sourceButton(v.page, "Explore the design story")}</div></div></section>`;
}
function exterior(state, browsingStyle) {
  const veil = state.villa === "veil";
  const white = veil && state.finish === "white";
  const page = veil ? (white ? 18 : 15) : 6;
  const palette = white
    ? [
        ["White stucco", "#eeeae0"],
        ["White travertine", "#deddd3"],
        ["Natural teak", "#98714e"],
        ["Matte black frame", "#343631"],
        ["Clear tempered glass", "#adbaba"],
        ["Sand-finish stone", "#cbbf9f"],
      ]
    : [
        ["Warm beige stucco", "#d7c6a8"],
        ["Light travertine", "#c8b99b"],
        ["Natural teak", "#98714e"],
        [
          veil ? "Clear tempered glass" : "Matte black frame",
          veil ? "#adbaba" : "#343631",
        ],
        ["Light grey concrete", "#a8a7a0"],
        ["Sand-finish stone", "#cbbf9f"],
      ];
  return `<section class="exterior chapter"><div class="exterior-copy">${label("03 / EXTERIOR MATERIALS")}<h2>Grounded in<br><em>the natural.</em></h2><p class="lead">${villas[state.villa].name}</p><p>A palette of understated textures and natural finishes, chosen to give the architecture a calm, enduring presence.</p>${veil ? `<div class="finish-options" role="group" aria-label="Exterior finish"><button data-finish="warm" aria-pressed="${!white}">Warm beige</button><button data-finish="white" aria-pressed="${white}">Soft white</button></div>` : ""}<div class="swatches">${palette.map(([name, color]) => `<div><span class="swatch" style="--swatch:${color}"></span><span>${name}</span></div>`).join("")}</div><div class="roof"><span class="small-label">ROOF & CORE</span><p>${veil && !white ? "Natural brown terracotta roof tile" : "Dark charcoal polymer shingle roof"}<br>EPS core (expanded polystyrene)</p></div>${sourceButton(page, "View the complete material board")}<p class="fine-print">Color circles are indicative. Refer to the catalogue material board for finishes.</p></div><button class="material-board" data-source="${page}" aria-label="Enlarge exterior material board"><img src="${publicAsset(`assets/page-${page}.webp`)}" alt="${villas[state.villa].name} ${white ? "white" : "warm"} exterior material and finish board"><span>THE MATERIAL STUDY <span>Enlarge ↗</span></span></button></section>`;
}
function interiors(state, browsingStyle) {
  const options = styles[state.villa];
  const s =
    options.find(
      (x) => x.name === (browsingStyle[state.villa] || state.style),
    ) || options[0];
  const selected = state.style === s.name;
  return `<section class="interiors chapter"><div class="interior-main"><div class="interior-picture"><img src="${publicAsset(`assets/${s.image}.webp`)}" data-fallback="assets/page-${s.page}.webp" alt="${s.name} interior direction for ${villas[state.villa].name}"><div class="interior-overlay">SECHA <span>INTERIOR DESIGN STUDIO</span></div></div><div class="interior-copy">${label("04 / YOUR INTERIOR DIRECTION")}<h2>A feeling,<br><em>made tangible.</em></h2><div class="style-tabs" role="group" aria-label="Interior concepts">${options.map((o) => `<button data-style="${o.name}" aria-pressed="${o.name === s.name}">${o.name}</button>`).join("")}</div><div class="style-details"><span class="small-label">${villas[state.villa].name} / INTERIOR CONCEPT</span><h3>${s.name}</h3><p>${s.description}</p><div class="mini-swatches" aria-label="Indicative color palette">${s.colors.map((c) => `<span style="background:${c}"></span>`).join("")}</div><p class="material-list">${s.materials.join(" · ")}</p></div><div class="interior-actions"><button class="primary" data-shortlist="${s.name}">${selected ? "Selected for your vision ✓" : "Choose this direction"} <span>${selected ? "" : "＋"}</span></button>${sourceButton(s.page, "Full moodboard")}</div><p class="fine-print">Explore a concept, then choose it to save it to your vision.</p></div></div></section>`;
}
function vision(state, browsingStyle) {
  const v = villas[state.villa];
  const s = styles[state.villa].find((x) => x.name === state.style);
  return `<section class="vision chapter"><div class="vision-heading">${label("05 / YOUR VISION")}<h2>Let’s make<br><em>space for you.</em></h2><p>A starting point for the conversation.<br>Your selections are saved in this browser.</p><div class="vision-actions"><button class="primary" id="export">Download your brief <span>↓</span></button><button class="text-link" id="print">Print / save PDF ↗</button></div><a class="text-link" href="${publicAsset("catalogue.pdf")}" download="To-Breathe-Signature-Catalogue.pdf">Download original catalogue ↓</a></div><div class="brief"><div class="brief-header"><span>TO BREATHE / CLIENT DIRECTION</span><span>FJÄLL GROUP × SECHA</span></div><div class="brief-row"><span class="small-label">ARCHITECTURE</span><div><h3>${v.name}</h3><span>FG–Signature ${v.signature}</span></div><button class="text-link" data-chapter="architecture">Edit ↗</button></div><div class="brief-row"><span class="small-label">EXTERIOR</span><div><h3>${state.villa === "veil" && state.finish === "white" ? "Soft white" : "Warm beige"}</h3><span>Natural stone · teak · sand-finish paving</span></div><button class="text-link" data-chapter="exterior">Edit ↗</button></div><div class="brief-row"><span class="small-label">INTERIORS</span><div><h3>${s ? s.name : "Still exploring"}</h3><span>${s ? "SECHA interior concept" : "Choose a direction to complete your shortlist"}</span></div><button class="text-link" data-chapter="interiors">${s ? "Edit" : "Choose"} ↗</button></div><label class="notes-label" for="notes">WHAT MATTERS MOST TO YOU?</label><textarea id="notes" maxlength="4000" placeholder="The feeling you want, the way you live, the details you love…">${escape(state.notes)}</textarea><div class="next-conversation"><span class="small-label">FOR OUR NEXT CONVERSATION</span><p>Site and orientation · Space requirements · Material samples · Budget and programme</p></div><p class="fine-print">A discussion brief, subject to project-specific design and specification. The catalogue does not provide pricing, floor plans, or delivery timelines.</p></div></section>`;
}

function film() {
  return `<section class="film chapter">
    <div class="film-heading">
      <div>${label("THE SIGNATURE FILM / 80 SECONDS")}<h2>A home,<br><em>in motion.</em></h2></div>
      <div class="film-heading-note"><p>A visual journey through the collection.<br>Original catalogue imagery, gently brought to life.</p>
      <a class="text-link" href="${publicAsset("video/to-breathe-walkthrough.mp4")}" download="To-Breathe-Walkthrough.mp4">Download the film ↓</a></div>
    </div>
    <div class="film-layout">
      <div class="film-screen">
        <video id="walkthrough-video" controls playsinline preload="metadata" poster="${publicAsset("video/poster.webp")}" aria-label="To Breathe, an 80-second visual walkthrough" aria-describedby="film-description">
          <source src="${publicAsset("video/to-breathe-walkthrough.mp4")}" type="video/mp4">
          <track kind="captions" src="${publicAsset("video/captions.vtt")}" srclang="en" label="English descriptive captions">
          Your browser does not support embedded video. <a href="${publicAsset("video/to-breathe-walkthrough.mp4")}">Download the walkthrough</a>.
        </video>
        <p id="film-description" class="fine-print">A silent film with on-screen text, gentle motion, and eight chapters. Use the player controls to pause, seek, or present fullscreen.</p>
        <p id="film-error" class="media-status" hidden>The film could not load. Try the MP4 download above, or explore the collection below.</p>
      </div>
      <aside class="film-chapters" aria-label="Video chapters">
        <div class="small-label">SKIP TO A MOMENT</div>
        ${filmChapters
          .map(
            (chapter, index) =>
              `<button data-video-time="${chapter.start}" ${index === 0 ? 'aria-current="true"' : ""}><span>${Math.floor(
                chapter.start / 60,
              )
                .toString()
                .padStart(
                  2,
                  "0",
                )}:${(chapter.start % 60).toString().padStart(2, "0")}</span><span>${chapter.title}</span><span aria-hidden="true">↗</span></button>`,
          )
          .join("")}
        <button class="primary" data-chapter="architecture">Find your architecture <span>↗</span></button>
      </aside>
    </div>
    <details class="film-transcript"><summary>Read the film transcript</summary><div>${filmChapters.map((chapter) => `<p><strong>${chapter.title}</strong> ${chapter.description}</p>`).join("")}</div></details>
  </section>`;
}

const templates = [
  intro,
  film,
  philosophy,
  architecture,
  exterior,
  interiors,
  vision,
];

export function renderChapter(step, state, browsingStyle) {
  return templates[step](state, browsingStyle);
}
