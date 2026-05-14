# legal.antu-technology.com

Landing page for **Antu Legal Search** — a self-hosted legal document retrieval engine for macOS.

## What's this?

This is the marketing / download site deployed to `legal.antu-technology.com`. It is a standalone static site, separate from:

- [`antu-website`](https://github.com/antu-tech/antu-website) — the education platform site (antu-edu.com)
- [`law-search-tool`](https://github.com/antu-tech/law-search-tool) — the application itself

## Deployment

This repo is designed to be deployed as a static site via **GitHub Pages** or any static host.

### GitHub Pages

1. Push this repo to `github.com/antu-tech/legal-website`
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → `main` / `root`
4. Add a custom domain: `legal.antu-technology.com`
5. Ensure your DNS has a CNAME record pointing to `antu-tech.github.io`

### Manual

```bash
# The entire site is a single static file
python3 -m http.server 8080
# Open http://localhost:8080
```

## Structure

```
.
├── index.html      # Single-page landing site
├── CNAME           # GitHub Pages custom domain config
└── README.md       # This file
```

## Design

Matches the Antu corporate design language:
- Primary: `#0f4c81` (deep navy)
- Accent: `#d4af37` (gold)
- Zero border-radius, clean typography
- Responsive down to mobile

## License

© 2026 Antu Technology. All rights reserved.
