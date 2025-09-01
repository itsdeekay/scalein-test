# Spectra Market — NFT Marketplace (Monorepo)

A modern, full‑stack NFT marketplace built with a clean, modular architecture:
- Web (Next.js 14, React 18, Tailwind CSS, SWR)
- API (Express 5, Mongoose 8, Socket.IO, Zod, JWT, Multer)
- MongoDB persistence
- Wallet login via personal_sign (EVM)

## Quick Start

Install dependencies: `pnpm install`

Run in development: `pnpm dev`

- API: http://localhost:4000
- Web: http://localhost:3000

## Features

Auth:
  - Email/password register & login (JWT cookies)
  - Wallet login via personal_sign (nonce-based, server-side verification)

NFTs:
  - Browse, filter, sort, infinite scroll
  - Mint (upload or generated SVG)
  - Buy (balance transfer), list/unlist
  - History (mint/list/sale/unlist)

Collections:
  - Browse collections, view detail and items

Real-time ticker:
  - Sales in the last hour via Socket.IO

Theming:
  - Light/Dark with localStorage + system preference

Accessibility:
  - Keyboard and ARIA support in custom Select and menus