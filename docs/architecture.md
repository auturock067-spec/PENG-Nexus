# PENG Nexus — V0.1 architecture
Status: implementation in draft PR, not production deployed.

## Responsibilities
- Core: PENG Nexus owns the static rendering template and content contract.
- Work: PlumbingSource, BuildMaterialHub, ApplianceSource, independent GitHub repos and deploys.
- Home: TeaSource, PetSupplyHub, HairSource (reserved for the home laptop; do not modify from Work).
- GitHub is the version of record. Each developer works on one designated project. Use PR-based changes.

## Technical design
- HTML/CSS/vanilla JavaScript generated at build time; **no runtime API or database** in V0.1.
- `site.json` stores industry-specific structured educational product references, topics, guides and FAQs.
- Generator `scripts/build.mjs` renders HTML into each site's `public` directory using shared template version.
- Cloudflare Pages serves `public` from GitHub's main branch after acceptance. Each site maps to one Pages project.
- Search runs in browser over a small reference collection; it does not access remote endpoints.
- No API keys, account sign-in, community posting or RFQ data collection yet.

## V0.2 roadmap (only after V0.1 acceptance)
1. True article routes, verified technical references, schema.org, XML sitemap and Search Console.
2. Supplier application workflow with consent, evidence attachment, approval state and correction history.
3. RFQ workflow: specific consent for sharing personal/contact details, rate limiting, spam checks, retention & deletion.
4. Moderated Q&A (not anonymous unmoderated postings).
5. Unified analytics, site_id, role-based access and uptime dashboard within PENG Product Center.
6. Optional Cloudflare D1 and R2 only when functional need is confirmed.

## Guardrails
- Do not list a manufacturer without verified legal identity, rights to publish its data, and a verification level.
- Never imply supplier endorsement, product certification, purchasing protection or escrow unless real contractual service exists.
- Export responsibilities and payment handling require separate regulatory and contract review.
- Prototype includes noindex and robots disallow; release only after content and legal review.
