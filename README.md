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
