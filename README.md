# Password Strength Meter

Client-side password strength and leak checker built with Astro.

Features:
- Estimates password entropy and likely crack times using a zxcvbn-inspired approach.
- Performs k-anonymity leak checks (Have I Been Pwned) from the browser — no plaintext passwords are transmitted.

Quick start:
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

License: MIT

Deployment (Cloudflare Pages via Wrangler):

This repository includes a GitHub Action that builds the site and publishes the `dist/` output to Cloudflare Pages using `wrangler`.

Setup:
1. Create a Cloudflare API token with Pages:Edit and Account:Read permissions and add it to the repository as the secret `CF_API_TOKEN`.
2. Push to `main` — the workflow will run automatically and publish the site.

After the workflow completes, find the site URL in your Cloudflare Pages dashboard and add it to this README.
