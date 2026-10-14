# To Breathe — Client Walkthrough

An interactive presentation based on the supplied **To Breathe / FG Signature Series** catalogue. Architecture by Fjäll Group; interior concepts by SECHA.

## Run

Requires Node.js 20.19+ or 22.12+ (validated with Node.js 24).

```sh
npm ci --cache /tmp/to-breathe-npm-cache
npm run dev
```

```sh
npm run check
npm run build
npm run test:hosting
npm run preview
```

## GitHub Pages

Both GitHub Pages publishing modes are supported:

- **Existing branch-based site:** publish `main` from `/ (root)`. Native browser modules load the source directly; relative asset paths and `.nojekyll` support the repository URL without a build step.
- **Recommended automated deployment:** under repository **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. The `Deploy walkthrough to GitHub Pages` workflow installs locked dependencies, runs checks, builds the app, and publishes `dist` whenever `main` changes. You can also run it manually from the Actions tab.

The expected repository URL is `https://jplovensa.github.io/to-breathe-walkthrough/`. Do not upload the Vite source as a compiled bundle; the workflow generates the production artifact. Relative build URLs also support custom domains. If enabling the Actions source after a failed run, rerun the workflow.

## Present

- Seven chapters cover the project philosophy, architecture, exterior materials, interior directions, and a client discussion brief.
- Use chapter buttons or left/right arrow keys to navigate; **Present** enters browser fullscreen.
- Explore Shelter of Sky and Veil of Light, including daylight and evening views from the catalogue.
- Veil of Light offers warm beige and soft white exterior boards.
- Browse the five interior concepts for each villa, then **Choose this direction** to save the shortlist.
- In **Your vision**, add discussion notes, download a text brief, or print/save the brief as PDF.
- Catalogue boards open in an accessible native dialog; press Escape to close. The original 23-page PDF is available to view and download.

Selections and notes stay in this browser's local storage (or in memory for the current session if storage is blocked); there is no server submission or cross-device synchronization. Fonts, renderings, and catalogue boards are served locally, without external runtime requests.

## Video walkthrough

**Watch the film** on the introduction opens an 80-second video built from the original catalogue. The film is locally hosted H.264 MP4 at 1280×720 (about 6.6 MB), with slow camera motion on architectural renderings, on-screen titles, and eight scenes. It is silent, with descriptive English captions and a text transcript. Native player controls provide pause, scrubbing, fullscreen, and mobile inline playback. Chapter buttons jump to a scene; the current scene is highlighted. **Download the film** saves a standalone MP4.

The film is at `public/video/to-breathe-walkthrough.mp4`, with its poster and WebVTT captions in the same directory. It presents catalogue renderings rather than live footage or a simulated 3D tour.

To regenerate the film from the retained catalogue images, install Python 3 and FFmpeg with H.264 encoding, then run:

```sh
npm run video:build
npm run check
npm run build
```

The generation script also refreshes `src/film-data.js` so chapter timings and captions stay synchronized. CI deploys the checked-in video; it does not require FFmpeg or re-encode the film.

## Asset references

`src/assets.js` explicitly registers catalogue and video files with module-relative `new URL(..., import.meta.url)` references. Vite rewrites those URLs for the built artifact, while a directly published source checkout resolves them relative to the module. Images and downloads therefore do not depend on the current chapter URL or on guessing a `public/` prefix. Checks validate every registered file and every villa/interior reference. Missing close-ups fall back to their original catalogue board; an unavailable board displays an explanatory status instead of a broken-image icon.

## Source and editorial scope

The original optimized catalogue is retained at `public/catalogue.pdf`. Original architectural renderings, interior imagery, and full-page material boards are in `public/assets/`. Presentation copy condenses the catalogue; palette circles are indicative, and full material boards remain available for reference. Pricing, floor plans, delivery timelines, and project-specific performance guarantees are not supplied by the catalogue. The final brief is a discussion aid rather than a final specification.

Fonts are distributed with their licenses in `public/fonts/`. No stock or generated architectural imagery is used.

## Validation

`npm run check` validates saved-state recovery, preservation of the interior choice when reselecting a villa, and downloaded brief contents. After a build, `npm run test:hosting` verifies that scripts, stylesheets, local fonts, catalogue pages, and the PDF resolve under a repository subpath, and checks native static-publishing paths.

Chromium checks exercised both the compiled production artifact and the unbuilt source at nested repository URLs, as well as a domain-root deployment. These checks covered seven chapters on desktop and mobile, every villa and interior image, font loading, catalogue dialogs, video playback and seeking, captions, MP4 downloads, transcripts, selection persistence, corrupted saved-state recovery, and requests staying inside the deployment path. Live GitHub Pages deployment requires the repository's Pages configuration and a successful publish; local validation does not establish that a deployment has finished.
