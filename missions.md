# Spectra Market — Role‑Based Missions

## Frontend Engineer (Next.js/React/Tailwind)

Mission: “Add Wishlist + UX Polish”

Goal: Let signed‑in users add NFTs to a client-side wishlist and improve discoverability.

Tasks:
1) Wishlist UI
   - On NFT card and NFT detail page, add a heart toggle to “Save to Wishlist”.
   - Persist in localStorage keyed by user id (so different users have different lists).
   - Show a subtle count badge on the header logo with the number of wishlisted items.
2) Wishlist Page
   - Add a new route: /wishlist to display wishlisted NFTs in a responsive grid.
   - Reuse NFTCard; ensure empty-state message and link to /market.
3) UX Polish
   - Add keyboard focus and aria-labels to the heart buttons.
   - Ensure theme compatibility (dark/light) and hover states.

Timebox: ~2 hours

---

## Backend Engineer (Node/Express/Mongoose)

Mission: “List/Unlist NFT with Validation + Metrics”

Goal: Harden list/unlist endpoints and expose simple metrics.

Tasks:
1) Validation & Errors
   - Strengthen POST /nfts/:id/list to reject non-positive prices, non-numeric input, and return consistent 400 errors (zod or service-layer guard).
   - Ensure unlist requires ownership and id validity; return 404/403 consistently.
2) Metrics Endpoint
   - Add GET /metrics/basic returning:
     - totalUsers
     - totalNfts
     - nftsOnSale
     - totalVolume (sum of Transaction.price for “sale”)
   - Implement via service layer; add a small controller and route.

Timebox: ~2 hours

---

## Full‑Stack Engineer

Mission: “User Profile Editing + Server Validation”

Goal: Allow editing username and bio on the profile page with server roundtrip and validation feedback.

Tasks:
1) UI Update
   - Extend /profile to allow editing username (min 3, max 30) and bio (max 1000).
   - Surface server validation errors inline (under inputs).
2) API Integration
   - Use PATCH /users/me (already exists) to update both fields.
   - Handle 409 “username already in use” gracefully (unique validation).
3) DX
   - Add a loading state on the Save button and a success toast/banner.

Timebox: ~2 hours

---

## Blockchain Engineer

Mission: “Wallet Login Robustness + Chain Awareness”

Goal: Improve wallet login UX and chain awareness (no on-chain tx required).

Tasks:
1) Chain Check
   - Detect current chainId via eth_chainId.
   - If not mainnet (0x1), show a non-blocking warning “For demo only: signature verified against chainId 1 in message.”
   - Do not block login; this is informational.
2) Signature UX
   - Ensure personal_sign is called with the correct address and message from /auth/nonce.
   - Enhance error messages for user-rejected actions and missing accounts.
3) Address Display
   - After login, show short wallet address in AuthControls (already supported), and add a copy-to-clipboard button.

Timebox: ~2 hours

---

## DevOps Engineer

Mission: “Local Docker Compose + Production Builds”

Goal: Provide a simple Docker-based local environment and production build scripts.

Tasks:
1) Dockerfiles
   - Create Dockerfile for apps/api (multi-stage: build then runtime) and apps/web (Next.js production server).
2) docker-compose.yml (root)
   - Services: mongodb, api, web
   - Networks and env wiring; volumes for Mongo data and uploads.
   - Healthchecks for api and mongodb.
3) Documentation
   - Update README section with “Docker Quickstart” (build, up, logs).
   - Ensure api depends_on mongodb healthy.

Timebox: ~2 hours

---

## QA Engineer

Mission: “High-Value Test Scenarios + Smoke Suite”

Goal: Author executable or documented test cases covering critical flows.

Tasks:
1) Test Plan (concise)
   - Draft a short test plan covering:
     - Auth: register, login, wallet login (happy/path + invalid).
     - Market browse: filters, sort, infinite scroll.
     - NFT: mint (with upload & with seed), buy, history visibility.
     - Profile update: validation and conflict handling.
     - Collections: list and detail.
     - Live ticker: presence and basic behavior.
2) Smoke Tests (Automated or Scripted)
   - Choose either:
     - Automated: lightweight Playwright or Cypress specs for top 3 flows (login, mint, buy).
     - Scripted: a reproducible manual test script using curl/Postman + web steps.
3) Reporting
   - Provide pass/fail matrix and defects with repro steps.

Timebox: ~2 hours

---

## Submission Guidelines

- Keep changes small and focused; push a branch or deliver a patch.
- Include a brief SUMMARY.md describing:
  - What you changed and why
  - How to run/validate
  - Any known tradeoffs or next steps
- Ensure `pnpm dev` runs without regressions and no console/server errors.