# To Breathe — Client Walkthrough

An interactive presentation based on the supplied **To Breathe / FG Signature Series** catalogue. Architecture by Fjäll Group; interior concepts by SECHA.

## Run

Requires Node.js 20.19+ or 22.12+ (validated with Node.js 24).

```sh
npm ci --cache /tmp/to-breathe-npm-cache
npm run dev
```

```sh
npm run build
npm run preview
```

## Present

- Six chapters cover the project philosophy, architecture, exterior materials, interior directions, and a client discussion brief.
- Use chapter buttons or left/right arrow keys to navigate; **Present** enters browser fullscreen.
- Explore Shelter of Sky and Veil of Light, including daylight and evening views from the catalogue.
- Veil of Light offers warm beige and soft white exterior boards.
- Browse the five interior concepts for each villa, then **Choose this direction** to save the shortlist.
- In **Your vision**, add discussion notes, download a text brief, or print/save the brief as PDF.
- Catalogue boards open in an accessible native dialog; press Escape to close. The original 23-page PDF is available to view and download.

Selections and notes stay in this browser's local storage; there is no server submission or cross-device synchronization. Fonts, renderings, and catalogue boards are served locally, without external runtime requests.

## Source and editorial scope

The original optimized catalogue is retained at `public/catalogue.pdf`. Original architectural renderings, interior imagery, and full-page material boards are in `public/assets/`. Presentation copy condenses the catalogue; palette circles are indicative, and full material boards remain available for reference. Pricing, floor plans, delivery timelines, and project-specific performance guarantees are not supplied by the catalogue. The final brief is a discussion aid rather than a final specification.

Fonts are distributed with their licenses in `public/fonts/`. No stock or generated architectural imagery is used.

## Validation

Production build and Chromium browser checks cover all six chapters at desktop and mobile sizes, image loading, villa and exterior selection, catalogue dialogs, interior shortlisting, local persistence, and downloaded brief contents.
