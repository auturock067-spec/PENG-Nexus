# PENG Nexus portal (Draft preview source)

This is a bilingual **HTML/CSS/vanilla JS** network landing page for the six industry repositories. It is **not** proof that any industry website is deployed or accepted.

## Preview locally (no paid dependencies)

From the repository root, run `python -m http.server 8000 --directory portal` (or any static HTTP server) and open `http://localhost:8000/`. To inspect without running a local server, open `portal/index.html` in a browser. The portal has no API calls, analytics, signup, payments or forms.

- Switch English/中文 in the header; all six cards are searchable in either language.
- Filter by industrial/building and consumer/lifestyle; zero results are announced.
- Each card links to the exact GitHub repository, **not** an invented public preview URL.
- Industry art is original inline SVG, not externally loaded images.
- Includes responsive 320–1440px CSS rules, keyboard landmarks, reduced-motion preference, noindex and robots.txt.
- The project is an informational prototype: no verified suppliers, quotations, guarantees or central RFQ collection.

## Release gate

Keep the existing PR **Draft**. Do not merge to main, configure production hosting, remove noindex, or make supplier/transaction claims without separate owner approval.

To validate: `npm test` (runs `test/portal.test.mjs` along with generator tests). Real Chromium/mobile visual checks, a hosted preview URL and Cloudflare commit-to-build verification remain **pending** until independently executed and recorded. Preserve work/home ownership boundaries; editing this central portal does not overwrite any industry site.
