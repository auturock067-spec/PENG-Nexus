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
