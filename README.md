<p align="center">
  <h1 align="center">⚡ NexaPay</h1>
  <p align="center"><strong>Level Up Instantly</strong></p>
  <p align="center">Premium Digital Top-Up & Gaming Platform</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
</p>

---

## 🚀 Overview

NexaPay is a **unicorn-grade digital top-up platform** rivaling UniPin & Codashop. Built with the latest web technologies, it features a stunning futuristic UI with glassmorphism, neon accents, smooth animations, and a mobile-first responsive design that works flawlessly across all devices from 320px to 4K.

### ✨ Key Features

- 🎮 **Game Top-Up** — 500+ games, instant processing in < 30 seconds
- 📱 **Digital Products** — Pulsa, paket data, PLN, voucher, gift cards, streaming
- 💳 **12+ Payment Methods** — QRIS, e-wallets, bank transfer, convenience stores, crypto
- 🤖 **AI Chatbot** — Rule-based chatbot with smart responses
- 🌙 **Dark/Light Mode** — Beautiful themes with smooth transitions
- 📊 **Admin Dashboard** — Full analytics, product/user/transaction management
- 🎯 **Loyalty System** — Bronze → Diamond tier with increasing discounts
- 🔗 **Referral Program** — Earn rewards for inviting friends
- 🔥 **Flash Sales** — Live countdown timers with urgency animations
- 🌐 **PWA Ready** — Installable progressive web app
- 📱 **Mobile-First** — Responsive across 8 breakpoints (320px → 4K)
- 🔍 **SEO Optimized** — Meta tags, Open Graph, structured data

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion 11 |
| **State Management** | Zustand 5 |
| **Database** | PostgreSQL 16 + Prisma ORM 6 |
| **Auth** | NextAuth.js v5 (Auth.js) |
| **UI Components** | Radix UI Primitives |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Toast** | Sonner |
| **Fonts** | Inter + Space Grotesk + JetBrains Mono |

---

## 📁 Project Structure

```
nexapay/
├── prisma/
│   └── schema.prisma          # Database schema (14 models)
├── public/
│   ├── manifest.json           # PWA manifest
│   └── images/                 # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 🏠 Homepage
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Design system
│   │   ├── login/              # 🔐 Auth pages
│   │   ├── topup/              # 🎮 Game top-up catalog + flow
│   │   ├── products/           # 📦 Digital products
│   │   ├── promo/              # 🔥 Promotions
│   │   ├── checkout/           # 🛒 Checkout
│   │   ├── payment-status/     # ✅ Payment tracking
│   │   ├── dashboard/          # 👤 User dashboard
│   │   ├── admin/              # 🔧 Admin panel
│   │   ├── news/               # 📰 Blog & news
│   │   ├── help/               # ❓ Help center
│   │   ├── contact/            # 📞 Contact
│   │   ├── terms/              # 📜 Terms
│   │   └── privacy/            # 🔒 Privacy policy
│   ├── components/
│   │   ├── home/               # Homepage sections
│   │   ├── layout/             # Navbar, Footer, MobileNav
│   │   ├── shared/             # LiveChat, etc.
│   │   └── providers/          # ThemeProvider
│   ├── data/                   # Mock data (games, products, testimonials)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities, constants
│   ├── stores/                 # Zustand state stores
│   └── types/                  # TypeScript definitions
├── docker-compose.yml          # PostgreSQL for local dev
├── tailwind.config.ts          # Design tokens & custom config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL 16 (or Docker)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nexapay/nexapay.git
cd nexapay

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your database URL and OAuth credentials

# 4. Start PostgreSQL (if using Docker)
docker-compose up -d

# 5. Generate Prisma client & push schema
npm run db:generate
npm run db:push

# 6. Seed the database (optional)
npm run db:seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📋 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, promo carousel, popular games, flash sale, trending, stats, testimonials |
| Top Up Catalog | `/topup` | Game catalog with search & filters |
| Top Up Flow | `/topup/[slug]` | Multi-step: select nominal → enter ID → payment → checkout |
| Products | `/products` | Digital products catalog |
| Product Detail | `/products/[slug]` | Single-page purchase flow |
| Payment Status | `/payment-status/[id]` | Real-time status tracking |
| Login/Register | `/login` | OAuth + email auth |
| Dashboard | `/dashboard` | Profile, wallet, loyalty, recent transactions |
| Transaction History | `/dashboard/transactions` | Full transaction list with filters |
| Admin Dashboard | `/admin` | Analytics, charts, recent transactions, top products |
| Promo | `/promo` | Active promotions with copy codes |
| News | `/news` | Blog articles and updates |
| Help Center | `/help` | FAQ, search, contact options |
| Contact | `/contact` | Contact form + info |
| Terms | `/terms` | Terms of service |
| Privacy | `/privacy` | Privacy policy |

---

## 🎨 Design System

- **Colors**: Navy `#0A0E1A` → Violet `#7C3AED` → Cyan `#06B6D4`
- **Effects**: Glassmorphism, neon glow, gradient cards
- **Typography**: Inter (body), Space Grotesk (headings)
- **Animations**: Framer Motion page transitions, scroll-triggered, hover effects
- **Responsive**: 8 breakpoints — 320px, 375px, 425px, 768px, 1024px, 1440px, 1920px, 2560px

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexapay.id | admin123 |
| User | user@nexapay.id | user123 |

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set the following environment variables in Vercel dashboard:
- `DATABASE_URL` — PostgreSQL connection string (use Supabase, Neon, or Railway)
- `NEXTAUTH_SECRET` — Random secret key
- `NEXTAUTH_URL` — Your deployed URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` — Discord OAuth

---

## 📄 License

Copyright © 2026 NexaPay. All rights reserved.

---

<p align="center">
  Built with ❤️ by the NexaPay Team
</p>
