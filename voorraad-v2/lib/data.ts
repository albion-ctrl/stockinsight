import { Vehicle, ActionItem, ActionType, MarketListing, KPISnapshot } from "@/types";
import { getDaysInStock, getStatus, calcInterestCost, calcRecommendedPrice, getDiscountPct, getUrgencyScore } from "@/lib/utils";
import { format, subDays } from "date-fns";

const today = new Date();
const d = (n: number) => format(subDays(today, n), "yyyy-MM-dd");

// ── Raw vehicle seed data ─────────────────────────────────────────────
const RAW = [
  { id:"V001", name:"MAN TGX 18.510 4x2 BLS",            type:"truck",      brand:"MAN", branch:"Duiven",    year:2021, mileage:287000, category:"used",  price:89500,  date_added:d(112) },
  { id:"V002", name:"VW Crafter 35 2.0 TDI L3H3",        type:"van",        brand:"VW",  branch:"Duiven",    year:2022, mileage:54000,  category:"used",  price:34900,  date_added:d(67)  },
  { id:"V003", name:"MAN TGS 26.400 6x2-4 BL",           type:"truck",      brand:"MAN", branch:"Duiven",    year:2020, mileage:412000, category:"used",  price:72000,  date_added:d(18)  },
  { id:"V004", name:"VW Transporter 2.0 TDI L2H1",       type:"van",        brand:"VW",  branch:"Eindhoven", year:2023, mileage:12000,  category:"used",  price:42500,  date_added:d(8)   },
  { id:"V005", name:"MAN TGM 18.290 4x2 BL Box",         type:"truck",      brand:"MAN", branch:"Eindhoven", year:2019, mileage:198000, category:"used",  price:58000,  date_added:d(95)  },
  { id:"V006", name:"VW Multivan 2.0 TDI DSG",           type:"van",        brand:"VW",  branch:"Eindhoven", year:2022, mileage:38000,  category:"used",  price:49900,  date_added:d(43)  },
  { id:"V007", name:"MAN TGX 18.480 4x2 BLS Retarder",   type:"truck",      brand:"MAN", branch:"Eindhoven", year:2023, mileage:0,      category:"new",   price:148000, date_added:d(22)  },
  { id:"V008", name:"VW Caddy 2.0 TDI Cargo",            type:"van",        brand:"VW",  branch:"Nijmegen",  year:2023, mileage:8500,   category:"new",   price:27900,  date_added:d(5)   },
  { id:"V009", name:"MAN TGL 12.220 4x2 BL Box Van",     type:"truck",      brand:"MAN", branch:"Nijmegen",  year:2020, mileage:145000, category:"used",  price:44500,  date_added:d(78)  },
  { id:"V010", name:"VW Crafter 50 2.0 TDI Refrigerated",type:"van",        brand:"VW",  branch:"Nijmegen",  year:2021, mileage:89000,  category:"used",  price:38500,  date_added:d(119) },
  { id:"V011", name:"MAN TGX 26.500 6x2 BLS XXL",        type:"truck",      brand:"MAN", branch:"Venlo",     year:2022, mileage:176000, category:"used",  price:112000, date_added:d(34)  },
  { id:"V012", name:"VW Transporter 2.0 TDI Combi",      type:"van",        brand:"VW",  branch:"Venlo",     year:2021, mileage:67000,  category:"used",  price:31500,  date_added:d(52)  },
  { id:"V013", name:"MAN TGS 18.360 4x2 EfficientLine",  type:"truck",      brand:"MAN", branch:"Venlo",     year:2021, mileage:234000, category:"used",  price:67500,  date_added:d(14)  },
  { id:"V014", name:"VW Crafter 35 2.0 TDI 4Motion",     type:"van",        brand:"VW",  branch:"Stein",     year:2023, mileage:0,      category:"new",   price:51900,  date_added:d(61)  },
  { id:"V015", name:"MAN TGM 15.290 4x2 Container",      type:"truck",      brand:"MAN", branch:"Stein",     year:2018, mileage:289000, category:"used",  price:36000,  date_added:d(88)  },
  { id:"V016", name:"VW Caddy Maxi 2.0 TDI Combi",       type:"van",        brand:"VW",  branch:"Stein",     year:2022, mileage:29000,  category:"used",  price:29500,  date_added:d(28)  },
  { id:"V017", name:"MAN TGX 18.510 4x2 XLX Full Spec",  type:"truck",      brand:"MAN", branch:"Tiel",      year:2022, mileage:312000, category:"used",  price:94000,  date_added:d(47)  },
  { id:"V018", name:"VW Multivan 1.4 eHybrid Premium",   type:"van",        brand:"VW",  branch:"Tiel",      year:2023, mileage:5200,   category:"used",  price:64900,  date_added:d(11)  },
  { id:"V019", name:"MAN TGL 8.190 4x2 Tipper Frame",    type:"truck",      brand:"MAN", branch:"Tiel",      year:2019, mileage:167000, category:"used",  price:39900,  date_added:d(73)  },
  { id:"V020", name:"VW Crafter 35 2.0 TDI Ambulance",   type:"van",        brand:"VW",  branch:"Tiel",      year:2020, mileage:122000, category:"used",  price:44500,  date_added:d(36)  },
] as const;

// ── Action item generator ─────────────────────────────────────────────
const ACTION_THRESHOLDS: { type: ActionType; days: number }[] = [
  { type: "price_reduction", days: 30 },
  { type: "photo_update",    days: 45 },
  { type: "call_prospect",   days: 60 },
  { type: "export_platform", days: 90 },
];

function buildActions(vehicleId: string, daysInStock: number): ActionItem[] {
  return ACTION_THRESHOLDS
    .filter(r => daysInStock >= r.days)
    .map((r, i) => ({
      id: `${vehicleId}-act-${i}`,
      vehicle_id: vehicleId,
      action_type: r.type,
      completed: false,
      completed_by: null,
      completed_at: null,
    }));
}

// ── Simulated market listings from AutoScout24, Gaspedaal, Marktplaats ──
const NL_LOCATIONS = ["Utrecht", "Rotterdam", "Amsterdam", "The Hague", "Breda", "Tilburg", "Arnhem", "Groningen"];
const DEALERS = ["Van der Berg Trucks", "Linders Commercial", "De Vries Used Cars", "ABC Trucks BV", "Hofman Vehicles", "Top Used Venlo"];

function buildMarketListings(v: typeof RAW[number], marketAvgDelta: number): MarketListing[] {
  const base = v.price;
  return [
    {
      source: "AutoScout24",
      url: "https://www.autoscout24.nl",
      title: v.name,
      price: Math.round(base * (0.90 + marketAvgDelta * 0.35)),
      year: v.year,
      mileage: v.mileage + 15000,
      location: NL_LOCATIONS[1],
      days_online: 23,
      dealer: DEALERS[0],
    },
    {
      source: "Gaspedaal",
      url: "https://www.gaspedaal.nl",
      title: v.name,
      price: Math.round(base * (0.91 + marketAvgDelta * 0.3)),
      year: v.year - 1,
      mileage: v.mileage + 28000,
      location: NL_LOCATIONS[3],
      days_online: 41,
      dealer: DEALERS[2],
    },
    {
      source: "Marktplaats",
      url: "https://www.marktplaats.nl",
      title: `${v.brand} ${v.name.split(" ").slice(1, 3).join(" ")}`,
      price: Math.round(base * (0.89 + marketAvgDelta * 0.35)),
      year: v.year,
      mileage: v.mileage + 8000,
      location: NL_LOCATIONS[5],
      days_online: 18,
      dealer: DEALERS[4],
    },
  ];
}

// ── Assemble full vehicles ────────────────────────────────────────────
const MARKET_DELTA_BY_DAYS = (days: number) => {
  if (days >= 90) return -0.12;
  if (days >= 60) return -0.08;
  if (days >= 45) return -0.05;
  if (days >= 30) return -0.02;
  return 0.02;
};

export const VEHICLES: Vehicle[] = RAW.map(v => {
  const days = getDaysInStock(v.date_added);
  const interest = calcInterestCost(v.price, days);
  const recommended = calcRecommendedPrice(v.price, days);
  const discount = getDiscountPct(days);
  const marketDelta = MARKET_DELTA_BY_DAYS(days);
  const actions = buildActions(v.id, days);
  const listings = buildMarketListings(v, marketDelta);
  const avgMarket = Math.round(listings.reduce((a, l) => a + l.price, 0) / listings.length);
  const marketDeltaPct = Math.round(((v.price - avgMarket) / avgMarket) * 100);

  return {
    ...(v as any),
    days_in_stock: days,
    status: getStatus(days),
    interest_cost: interest,
    urgency_score: getUrgencyScore(days, v.price),
    recommended_price: recommended,
    discount_pct: discount,
    market_delta_pct: marketDeltaPct,
    pending_actions: actions.filter(a => !a.completed).length,
    action_items: actions,
    market_listings: listings,
  } as Vehicle;
}).sort((a, b) => b.urgency_score - a.urgency_score);

// ── KPI snapshot ──────────────────────────────────────────────────────
export function computeKPIs(vehicles: Vehicle[]): KPISnapshot {
  const n = vehicles.length;
  return {
    total_vehicles: n,
    total_interest_cost: vehicles.reduce((s, v) => s + v.interest_cost, 0),
    needs_action: vehicles.filter(v => v.days_in_stock > 45).length,
    critical: vehicles.filter(v => v.days_in_stock > 90).length,
    avg_days: Math.round(vehicles.reduce((s, v) => s + v.days_in_stock, 0) / (n || 1)),
    avg_market_delta: Math.round(vehicles.reduce((s, v) => s + v.market_delta_pct, 0) / (n || 1)),
  };
}

// ── Labels ────────────────────────────────────────────────────────────
export const ACTION_LABELS: Record<ActionType, string> = {
  price_reduction: "Reduce Price",
  photo_update:    "Photo Update",
  call_prospect:   "Call Prospect",
  export_platform: "Export Platform",
};

export const ACTION_DESC: Record<ActionType, string> = {
  price_reduction: "Vehicle has been in stock >30 days. Adjust price based on market recommendation.",
  photo_update:    "Vehicle has been in stock >45 days. Fresh photos increase interest by ~22%.",
  call_prospect:   "Vehicle has been in stock >60 days. Follow up with previously interested buyers.",
  export_platform: "Vehicle has been in stock >90 days. List on TruckScout24 or Truck1.eu.",
};

export const BRANCHES = ["Duiven","Eindhoven","Nijmegen","Venlo","Stein","Tiel"] as const;

export const SOURCE_COLORS: Record<string, string> = {
  AutoScout24:  "market-source-autoscout",
  Gaspedaal:    "market-source-gaspedaal",
  Marktplaats:  "market-source-marktplaats",
};
