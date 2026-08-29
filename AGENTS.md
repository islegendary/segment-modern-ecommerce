# AGENTS.md

Instructions for AI coding agents working in this repository.

## Cursor Cloud specific instructions

This is a Vite + React storefront. Node 20+ is required (see `.nvmrc`).

### Commands

- `npm run dev` starts the Vite development server at http://localhost:5173. This is the Cloud Agent `start` command. Leave it running; do not treat it as a one-shot task.
- `npm run build` produces a production build in `dist/`.
- `npm run lint` runs ESLint (`eslint .`).

Install dependencies with `npm install` (the Cloud Agent `install` command). `npm run preview` serves the production build locally.

A Segment write key is optional. The storefront runs, lints, and builds without one.

### Segment analytics

Console logging of `page`, `track`, and `identify` always stays on. A write key only adds live Segment sends. Do not remove, gate, or replace console logging with live sends.

Set `VITE_SEGMENT_WRITE_KEY` in `.env` (see `.env.example`) or paste a key in `src/analytics.js`. Placeholder values (`YOUR_SEGMENT_WRITE_KEY_HERE`, empty, or `<YOUR_SEGMENT_WRITE_KEY>`) keep console logging and do not call Segment.

Do not change storefront behavior or Segment event names. Event names and property keys live in `src/analytics.js` and the page trackers that call it.
