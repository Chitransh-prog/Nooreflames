# NOOR-E-FLAMES — Next.js & Sanity CMS Architecture

This project has been converted into a Next.js 14 (App Router) application with Sanity CMS integrated.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run the following command in your terminal:
```bash
npm install
```

### 2. Configure Sanity CMS Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your Sanity Project ID (create a free project at [sanity.io/manage](https://www.sanity.io/manage)):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Sanity CMS Content Studio

You can manage your products, hero slideshows, scrolling ticker banners, and site configuration directly inside the app!

* **Studio URL**: [http://localhost:3000/studio](http://localhost:3000/studio)

### Included Schemas (`/sanity/schemas`):
1. **`product.ts`**: Product title, price, original price, badge, category (EDPs, Attars, Candles), image, notes.
2. **`heroSlide.ts`**: Hero banner titles, subheadings, call-to-action buttons, desktop & mobile image assets.
3. **`scrollingBanner.ts`**: Ticker banner announcements & scroll speed.
4. **`siteSettings.ts`**: Brand name, announcement header text, meta description.

---

## 🎨 Design & Typography
* **Headers & Titles**: `Instrument Serif`
* **Body & UI Elements**: `Instrument Sans`
