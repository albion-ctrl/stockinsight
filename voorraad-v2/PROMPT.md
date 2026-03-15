# VoorraadInzicht — Project Prompt Document
**Versie:** 1.0  
**Opdrachtgever:** Den Engelsen Bedrijfswagens (denengelsen.eu)  
**Prepared by:** Revido  
**Status:** Prototype gereed voor demo

---

## 1. Het Probleem

Den Engelsen Bedrijfswagens heeft een "inkoop & doorverkoop" strategie voor bedrijfsvoertuigen. Voertuigen worden ingekocht op krediet. Elke dag dat een voertuig **niet** verkocht wordt, loopt er rente op — typisch **5–6% per jaar** over de inkoopprijs.

Met honderden voertuigen verspreid over 6 vestigingen (Duiven, Eindhoven, Nijmegen, Venlo, Stein, Tiel) is er **geen centraal overzicht** van welke voertuigen het langst in voorraad staan, hoeveel ze kosten per dag, en wat de oorzaak is van de trage doorlooptijd.

**Resultaat:** De directeur betaalt rente over voertuigen zonder te weten welke het urgentst zijn of wat hij eraan kan doen.

---

## 2. De Oplossing: VoorraadInzicht

Een intern webapplicatie voor het verkoopteam dat:

1. **Rentekosten zichtbaar maakt** per voertuig, per vestiging en totaal
2. **Marktpositie analyseert** door vergelijking met AutoScout24, Gaspedaal en Marktplaats
3. **Actieaanbevelingen genereert** automatisch op basis van voorraaddagen
4. **Verkopers en managers** een werklijst geeft met concrete te-doen items

---

## 3. Tech Stack

| Laag | Technologie |
|------|-------------|
| Frontend | Next.js 14 (App Router) |
| UI Components | shadcn/ui + Tailwind CSS |
| Database | Supabase (PostgreSQL + Auth) |
| Taal | TypeScript |
| Fonts | DM Sans + DM Mono |

---

## 4. Core Features

### 4.1 KPI Dashboard (bovenste balk)
- Totaal voertuigen in voorraad
- Totale rentekosten tot heden (in euros)
- Aantal voertuigen actie vereist (>45 dagen)
- Aantal kritische gevallen (>90 dagen)
- Gemiddelde voorraaddagen
- Gemiddeld % boven marktgemiddelde

### 4.2 Voertuigenlijst (links panel)
- Gesorteerd op urgentiescore (rente + dagen + marktgap)
- Kleurcodering: groen <30d, amber 30-45d, rood >45d
- Filters: vestiging, type, merk, status
- Rentekosten zichtbaar per voertuig

### 4.3 Voertuig Detail (rechts panel - 3 tabs)

**Tab Overzicht:** Prijsadvies, rentekosten, kosten per dag, marktpositie, voertuiggegevens

**Tab Acties:** Automatische acties op basis van voorraaddagen:
- 30 dagen: Prijs verlagen (met exact bedrag)
- 45 dagen: Foto-update maken
- 60 dagen: Prospect bellen
- 90 dagen: Exportplatform (TruckScout24, Truck1.eu)

**Tab Marktanalyse:** Prijsvergelijking met:
- AutoScout24 (autoscout24.nl)
- Gaspedaal (gaspedaal.nl)
- Marktplaats (marktplaats.nl)

### 4.4 Rente Calculator
```
Rentekosten = (Prijs x 5.5% x Dagen) / 365
Voorbeeld: 89500 x 0.055 x 112 / 365 = EUR 1.514
```

### 4.5 Urgentiescore
```
Score = Totale rente x Dagengewicht
>90d = x3, >60d = x2, >45d = x1.5, >30d = x1
```

---

## 5. Rollenmodel

| Rol | Toegang |
|-----|---------|
| manager | Alle vestigingen + rapporten |
| verkoper | Alleen eigen vestiging |

---

## 6. Marktdata Integratie

### Prototype
Gesimuleerde data per platform — voldoende voor demo.

### Productie
| Platform | Methode |
|----------|---------|
| AutoScout24 | Officiële Dealer API |
| Gaspedaal | Web scraper |
| Marktplaats | Adverteerders API |

Dagelijkse cron job vult de market_cache tabel.

---

## 7. Installatie

### Demo mode (geen Supabase nodig)
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open: http://localhost:3000

### Demo accounts
| Rol | Email | Wachtwoord |
|-----|-------|------------|
| Manager | manager@denengelsen.nl | demo1234 |
| Verkoper | verkoper.duiven@denengelsen.nl | demo1234 |

---

## 8. Demo Script voor presentatie

**Opening:**
"Michel, dit dashboard laat u in één oogopslag zien welke voertuigen u nu geld kosten — en precies hoeveel."

**Stap 1 — KPI balk:**
"Dit getal zijn uw totale rentekosten vandaag over voertuigen die nog niet verkocht zijn."

**Stap 2 — Slechtste voertuig:**
"Dit voertuig staat 112 dagen. Rentekosten: EUR 1.514. Op AutoScout24 staat een vergelijkbare truck voor EUR 8.000 minder. Dáár zit het probleem."

**Stap 3 — Acties tab:**
"Het systeem bepaalt al wat u moet doen: prijs verlagen naar EUR 84.130, nieuwe foto's, prospects nabellen. Uw verkoper vinkt het af."

**Stap 4 — Marktanalyse:**
"We halen dit automatisch op van AutoScout24, Gaspedaal en Marktplaats. Nooit meer handmatig googelen."

**Afsluiter:**
"De investering verdient zichzelf terug zodra één auto sneller verkoopt."

---

## 9. Vervolgstappen na Demo

1. Echte data import via CSV uit hun DMS/Excel
2. Marktdata APIs koppelen (AutoScout24 dealer API aanvragen)
3. Supabase productie opzetten met echte gebruikers
4. Rentepercentage aanpassen naar werkelijk tarief
5. Email/WhatsApp notificaties instellen
6. Mobiele weergave optimaliseren

---

## 10. Bestandsstructuur

```
voorraad-inzicht/
├── app/
│   ├── dashboard/page.tsx      Main dashboard
│   ├── login/page.tsx          Login pagina
│   └── globals.css             Design system
├── components/
│   ├── ui/                     shadcn/ui componenten
│   └── dashboard/
│       ├── KPIBar.tsx          KPI metrics balk
│       ├── VehicleCard.tsx     Voertuig lijst kaart
│       └── VehicleDetail.tsx   Detail panel (3 tabs)
├── lib/
│   ├── data.ts                 Mock data + business logic
│   └── utils.ts                Berekeningen + formatters
├── types/index.ts              TypeScript types
├── supabase/schema.sql         Database schema + RLS
└── .env.example                Environment variabelen
```

---

## 11. Aanpasbare parameters

In lib/utils.ts:
- Rentepercentage: `rate = 0.055` (5.5%)
- Kortingspercentages: 2% na 30d, 4% na 45d, 6% na 90d

In lib/data.ts:
- Actie drempelwaarden aanpassen
- Nieuwe platforms toevoegen

---

*Opgesteld door Revido voor Den Engelsen Bedrijfswagens*
