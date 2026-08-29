# Segment Modern E-commerce Setup Guide

## Prerequisites

- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **Git**: for cloning the repository

```bash
node --version
npm --version
git --version
```

## Install and run

```bash
git clone https://github.com/islegendary/segment-modern-ecommerce.git
cd segment-modern-ecommerce
npm install
npm run dev
```

The app is at `http://localhost:5173`.

```bash
npm run build
npm run preview
npm run lint
```

## Segment

The store always logs `page`, `track`, and `identify` calls to the browser console. A write key does not replace that. It also sends the same events with `@segment/analytics-next`.

Set the key in `src/analytics.js`, or copy `.env.example` to `.env`:

```env
VITE_SEGMENT_WRITE_KEY=your_segment_write_key
```

Placeholder values (`YOUR_SEGMENT_WRITE_KEY_HERE`, empty, or `<YOUR_SEGMENT_WRITE_KEY>`) keep logging to the console and do not call Segment.

## Events

- `analytics.page()`: home, category, product, cart, checkout, confirmation, signup, custom form
- `analytics.track()`: Product List Viewed, Product Clicked, Product Viewed, Product Added, Product Removed, Cart Viewed, Checkout Started, Order Completed, Signed Up, Form Submitted
- `analytics.identify()`: signup and custom robot form

Product and order properties follow Segment Spec v2 names (`product_id`, `name`, `order_id`, `currency`, `revenue`).

## Deploy

Vercel auto-detects Vite. Set `VITE_SEGMENT_WRITE_KEY` in the host if you want live sends in production. Netlify, GitHub Pages, and S3 work from the `dist/` folder after `npm run build`.
