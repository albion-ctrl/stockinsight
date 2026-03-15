# VoorraadInzicht

Internal inventory management tool for Den Engelsen Bedrijfswagens.

Built with **Next.js 14 + shadcn/ui + Supabase + TypeScript**.

## Quick start (demo, no Supabase needed)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — redirects straight to dashboard with mock data.

## What it does

- Tracks **interest costs** per vehicle (5.5% p/y on sticker price)
- Compares prices against **AutoScout24, Gaspedaal, Marktplaats**
- Generates **action items** at 30/45/60/90 days in stock
- Prioritises vehicles by **urgency score** (interest × age × market gap)

## Roles

- **Manager** — sees all 6 branches (Duiven, Eindhoven, Nijmegen, Venlo, Stein, Tiel)
- **Verkoper** — sees own branch only

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Manager | manager@denengelsen.nl | demo1234 |
| Verkoper | verkoper.duiven@denengelsen.nl | demo1234 |

## Supabase setup (production)

1. Create project at app.supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Fill in `.env.local` with your keys
4. `npm run dev`

## Project structure

```
app/dashboard/page.tsx      — Main split-panel dashboard
app/login/page.tsx          — Login page
components/dashboard/       — KPIBar, VehicleCard, VehicleDetail
components/ui/              — shadcn/ui components
lib/data.ts                 — Mock vehicles + market listings
lib/utils.ts                — Interest calc, formatters
types/index.ts              — TypeScript interfaces
supabase/schema.sql         — DB schema + RLS policies
PROMPT.md                   — Full project specification
```
