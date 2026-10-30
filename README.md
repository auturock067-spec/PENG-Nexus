# PENG Nexus
A shared, dependency-free static site generator for the PENG specialist knowledge and future China sourcing network.

## V0.1 scope
- Six independent brand websites; one versioned HTML/CSS/JS template.
- **Work computer** owns `plumbing-source`, `build-material-hub`, and `appliance-source`.
- **Home laptop** owns `tea-source`, `pet-supply-hub`, and `hair-source`.
- Build outputs live in the individual website repositories; no shared runtime or cross-repository secrets.
- Initial public pages include an interactive product reference search, buying guides and a transparent *supplier directory planned* panel.
- No unverified suppliers, quotation forms, live inventory, payments or site analytics have been enabled.

## Build an industry site
From a checkout of this repo on the owning computer (Node.js 20+):
```powershell
cd D:\AgentForge\peng-nexus
node scripts/build.mjs --config ..\plumbing-source\site.json --out ..\plumbing-source\public
node --test
```
Commit the generated `public/` files to that industry's repository and review a draft PR before merging. For Home projects, use the corresponding configuration and project path.

## Cloudflare Pages (not yet connected)
Use the Git integration to connect each independent repository; production branch `main`; **Build command: leave blank**, **Build output directory: `public`**. Preview builds from PR branches can be enabled. Both site HTML and robots.txt intentionally block indexing during prototype review—remove that restriction only after real content, privacy/contact policies and publication approval are ready.

## Template version policy
A release of this central project is manually generated into each site's repo; individual sites are independently reviewed and deployed. Updating PENG Nexus does **not** overwrite an existing site automatically.

See `docs/architecture.md`, `docs/content-policy.md` and `schema/site.schema.json`.

## Six-industry network portal (Draft, not deployed)
A separate bilingual, mobile-first landing page now lives in [`portal/`](portal/README.md). It connects the six independent industry repositories without changing their code or deployment setup:
- PlumbingSource, BuildMaterialHub, ApplianceSource (Work computer)
- TeaSource, PetSupplyHub, HairSource (Home laptop)

Features: English/中文 switch, dual-language search and filter, original SVG illustrations, responsive layout, and transparent source-repository links. **These are GitHub repository links, not verified live sites.** The page has no central RFQ intake or transactions, and remains **noindex**.

Review source in `portal/index.html`, `portal/styles.css`, `portal/app.js`. Preview locally with `python -m http.server 8000 --directory portal` and run `npm test`. Hosted browser screenshots, accessibility testing at 320/390/768/1440px and a linked Cloudflare preview remain required before release.

