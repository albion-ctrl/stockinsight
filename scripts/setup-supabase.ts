import { createClient } from '@supabase/supabase-js';
import { format, subDays } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zzpwklgsqmrxxikfjlgl.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHdrbGdzcW1yeHhpa2ZqbGdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU5NTQ5NywiZXhwIjoyMDg5MTcxNDk3fQ.jUR_quxbdVBZyImIlRNfYNbde3WASLepjU-n79hrPIw';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const today = new Date();
const d = (n: number) => format(subDays(today, n), "yyyy-MM-dd");

const VEHICLES = [
  { id: "DE001", name: "MAN TGX 18.480 4x2 BL ACC Apple Carplay Koelkast Standairco", type: "truck", brand: "MAN", branch: "Nijmegen", year: 2023, mileage: 310374, category: "used", price: 57800, date_added: d(15), fuel_type: "Diesel", transmission: "Automaat", power: 480, color: "wit" },
  { id: "DE002", name: "MAN TGX 18.510 4x2 Trekker Retarder Smartlink Standairco Koelkast", type: "truck", brand: "MAN", branch: "Nijmegen", year: 2023, mileage: 335903, category: "used", price: 57800, date_added: d(8), fuel_type: "Diesel", transmission: "Automaat", power: 510, color: "wit" },
  { id: "DE003", name: "MAN TGX 18.510 4x2 Trekker Retarder Smartlink Standairco Koelkast", type: "truck", brand: "MAN", branch: "Nijmegen", year: 2023, mileage: 357863, category: "used", price: 56950, date_added: d(22), fuel_type: "Diesel", transmission: "Automaat", power: 510, color: "wit" },
  { id: "DE004", name: "MAN TGX 18.510 4x2 Trekker Retarder Smartlink Standairco Koelkast", type: "truck", brand: "MAN", branch: "Nijmegen", year: 2023, mileage: 379454, category: "used", price: 57650, date_added: d(5), fuel_type: "Diesel", transmission: "Automaat", power: 510, color: "wit" },
  { id: "DE005", name: "MAN TGX 18.510 4x2 Trekker Retarder Smartlink Standairco Koelkast", type: "truck", brand: "MAN", branch: "Nijmegen", year: 2023, mileage: 387698, category: "used", price: 56400, date_added: d(35), fuel_type: "Diesel", transmission: "Automaat", power: 510, color: "wit" },
  { id: "DE006", name: "Volkswagen Crafter 35 2.0 TDI 164pk L2H2 Airco Cruise control Trekhaak", type: "van", brand: "VW", branch: "Nijmegen", year: 2011, mileage: 161151, category: "used", price: 12900, date_added: d(67), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 164, color: "wit" },
  { id: "DE007", name: "Volkswagen Caddy 102pk Automaat L2H1 Maxi Highline Navigatie Airco", type: "van", brand: "VW", branch: "Nijmegen", year: 2018, mileage: 260630, category: "used", price: 8750, date_added: d(12), fuel_type: "Diesel", transmission: "Automaat", power: 102, color: "grijs" },
  { id: "DE008", name: "Volkswagen Transporter 2.0 TDI L1 Comfortline Trekhaak Cruise control", type: "van", brand: "VW", branch: "Nijmegen", year: 2018, mileage: 178964, category: "used", price: 11999, date_added: d(28), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 102, color: "zilver" },
  { id: "DE009", name: "Volkswagen Crafter e-Crafter L3H3/L2H2 36 kWh 136pk LED Apple Carplay", type: "van", brand: "VW", branch: "Eindhoven", year: 2019, mileage: 11200, category: "used", price: 16900, date_added: d(45), fuel_type: "Elektrisch", transmission: "Automaat", power: 136, color: "wit" },
  { id: "DE010", name: "MAN TGE 3.140 140pk Dubbele cabine L3H2/L2H1 Navigatie Trekhaak", type: "van", brand: "MAN", branch: "Eindhoven", year: 2019, mileage: 168364, category: "used", price: 17900, date_added: d(55), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 140, color: "wit" },
  { id: "DE011", name: "MAN TGE 140pk L3H3/L2H2 Apple Carplay Camera Airco Parkeersensoren", type: "van", brand: "MAN", branch: "Eindhoven", year: 2022, mileage: 154086, category: "used", price: 18600, date_added: d(18), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 140, color: "wit" },
  { id: "DE012", name: "MAN TGE 140pk L3H3/L2H2 Apple Carplay Camera Airco Parkeersensoren", type: "van", brand: "MAN", branch: "Eindhoven", year: 2022, mileage: 141006, category: "used", price: 18700, date_added: d(42), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 140, color: "wit" },
  { id: "DE013", name: "MAN TGE 140pk L3H3/L2H2 Apple Carplay Camera Airco Parkeersensoren", type: "van", brand: "MAN", branch: "Venlo", year: 2020, mileage: 116356, category: "used", price: 18850, date_added: d(78), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 140, color: "wit" },
  { id: "DE014", name: "Ford Transit Custom 130 PK Automaat L1H1 Airco Cruise Trekhaak", type: "van", brand: "Ford", branch: "Venlo", year: 2020, mileage: 164702, category: "used", price: 13900, date_added: d(33), fuel_type: "Diesel", transmission: "Automaat", power: 130, color: "wit" },
  { id: "DE015", name: "Ford Transit Custom 131pk L1H1 Trend 2x Schuifdeur Trekhaak", type: "van", brand: "Ford", branch: "Venlo", year: 2020, mileage: 114791, category: "used", price: 14400, date_added: d(52), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 131, color: "wit" },
  { id: "DE016", name: "Ford Transit Custom 131pk Automaat L1H1 Trend Apple Carplay Camera", type: "van", brand: "Ford", branch: "Duiven", year: 2022, mileage: 121463, category: "used", price: 18900, date_added: d(25), fuel_type: "Diesel", transmission: "Automaat", power: 131, color: "wit" },
  { id: "DE017", name: "Renault Master T35 135pk L3H2 Work Edition Apple Carplay Navigatie", type: "van", brand: "Renault", branch: "Duiven", year: 2021, mileage: 84901, category: "used", price: 15900, date_added: d(61), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 135, color: "wit" },
  { id: "DE018", name: "Renault Trafic 146pk Euro6 L2H1 Dubbele cabine Navi Trekhaak", type: "van", brand: "Renault", branch: "Duiven", year: 2017, mileage: 215438, category: "used", price: 9900, date_added: d(88), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 146, color: "wit" },
  { id: "DE019", name: "Mercedes-Benz Sprinter 314 CDI Automaat 140pk L2H2 Euro6 APK", type: "van", brand: "Mercedes-Benz", branch: "Stein", year: 2017, mileage: 361017, category: "used", price: 9400, date_added: d(95), fuel_type: "Diesel", transmission: "Automaat", power: 143, color: "wit" },
  { id: "DE020", name: "Peugeot Boxer 130pk L2H2 Glasresteel Imperiaal Airco Cruise control", type: "van", brand: "Peugeot", branch: "Stein", year: 2016, mileage: 174362, category: "used", price: 10900, date_added: d(72), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 130, color: "wit" },
  { id: "DE021", name: "Citroën Berlingo 1.6 BlueHDI 75pk Euro6 Club Parkeersensoren Airco", type: "van", brand: "Citroën", branch: "Tiel", year: 2017, mileage: 186232, category: "used", price: 5700, date_added: d(110), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 75, color: "wit" },
  { id: "DE022", name: "Toyota PROACE CITY 131pk Automaat Apple Carplay Camera Parkeersensoren", type: "van", brand: "Toyota", branch: "Tiel", year: 2020, mileage: 104053, category: "used", price: 15450, date_added: d(38), fuel_type: "Diesel", transmission: "Automaat", power: 131, color: "wit" },
  { id: "DE023", name: "Opel Vivaro 2.0 120pk L3H1 Dubbele cabine 5-zits Navi Apple Carplay", type: "van", brand: "Opel", branch: "Tiel", year: 2021, mileage: 100257, category: "used", price: 19400, date_added: d(48), fuel_type: "Diesel", transmission: "Handgeschakeld", power: 120, color: "wit" },
  { id: "DE024", name: "Škoda Fabia Combi 1.0 TSI 95pk Ambition", type: "van", brand: "Škoda", branch: "Nijmegen", year: 2021, mileage: 74547, category: "used", price: 13800, date_added: d(20), fuel_type: "Benzine", transmission: "Handgeschakeld", power: 95, color: "blauw" },
];

function calcInterestCost(price: number, days: number, rate = 0.055): number {
  return Math.round((price * rate * days) / 365);
}

function getStatus(days: number): "green" | "amber" | "red" {
  if (days < 30) return "green";
  if (days <= 45) return "amber";
  return "red";
}

function getDiscountPct(days: number): number {
  if (days >= 90) return 6;
  if (days >= 45) return 4;
  if (days >= 30) return 2;
  return 0;
}

function calcRecommendedPrice(price: number, days: number): number {
  if (days >= 90) return Math.round(price * 0.94);
  if (days >= 45) return Math.round(price * 0.96);
  if (days >= 30) return Math.round(price * 0.98);
  return price;
}

function getUrgencyScore(days: number, price: number, interestRate = 0.055): number {
  const dailyInterest = (price * interestRate) / 365;
  const totalInterest = dailyInterest * days;
  const daysWeight = days > 90 ? 3 : days > 60 ? 2 : days > 45 ? 1.5 : days > 30 ? 1 : 0.5;
  return Math.round(totalInterest * daysWeight);
}

function getDaysInStock(dateAdded: string): number {
  const added = new Date(dateAdded);
  const now = new Date();
  return Math.floor((now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24));
}

async function setupDatabase() {
  console.log("Setting up Supabase database...");

  // Create tables
  console.log("Creating tables...");

  // Create vehicles table
  const { error: vehiclesError } = await supabase.rpc('exec_sql', { 
    sql: `
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      brand TEXT NOT NULL,
      branch TEXT NOT NULL,
      year INTEGER NOT NULL,
      mileage INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      date_added DATE NOT NULL,
      color TEXT,
      fuel_type TEXT,
      transmission TEXT,
      power INTEGER,
      vin TEXT,
      days_in_stock INTEGER,
      status TEXT,
      interest_cost NUMERIC(10,2),
      urgency_score NUMERIC(10,2),
      recommended_price NUMERIC(10,2),
      discount_pct NUMERIC(5,2),
      market_delta_pct NUMERIC(5,2),
      pending_actions INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    `
  }).catch(() => null);

  // Try direct table creation via SQL
  const { error: createVehiclesError } = await supabase.from('vehicles').insert([{ 
    id: 'test', name: 'test', type: 'van', brand: 'VW', branch: 'Duiven', year: 2023, mileage: 0, category: 'new', price: 10000, date_added: '2024-01-01' 
  }]).catch((e) => {
    console.log("Tables may already exist or error:", e.message);
    return { error: null };
  });

  // If tables don't exist, let's create them using raw SQL via rpc
  try {
    // Try to create tables using the API
    console.log("Checking if tables exist...");
    
    // Check if we can read from vehicles table
    const { data: testData, error: testError } = await supabase
      .from('vehicles')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.log("Tables don't exist, creating them...");
      
      // Create tables using SQL execution
      const { error: sqlError } = await supabase.rpc('exec', { 
        query: `
          CREATE TABLE IF NOT EXISTS vehicles (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            brand TEXT NOT NULL,
            branch TEXT NOT NULL,
            year INTEGER NOT NULL,
            mileage INTEGER NOT NULL DEFAULT 0,
            category TEXT NOT NULL,
            price NUMERIC(10,2) NOT NULL,
            date_added DATE NOT NULL,
            color TEXT,
            fuel_type TEXT,
            transmission TEXT,
            power INTEGER,
            days_in_stock INTEGER,
            status TEXT,
            interest_cost NUMERIC(10,2),
            urgency_score NUMERIC(10,2),
            recommended_price NUMERIC(10,2),
            discount_pct NUMERIC(5,2),
            market_delta_pct NUMERIC(5,2),
            pending_actions INTEGER
          );
          
          CREATE TABLE IF NOT EXISTS action_items (
            id TEXT PRIMARY KEY,
            vehicle_id TEXT NOT NULL,
            action_type TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            completed_by TEXT,
            completed_at TIMESTAMPTZ
          );
          
          CREATE TABLE IF NOT EXISTS market_listings (
            id SERIAL PRIMARY KEY,
            vehicle_id TEXT NOT NULL,
            source TEXT NOT NULL,
            url TEXT NOT NULL,
            title TEXT NOT NULL,
            price INTEGER NOT NULL,
            year INTEGER NOT NULL,
            mileage INTEGER NOT NULL,
            location TEXT NOT NULL,
            days_online INTEGER NOT NULL,
            dealer TEXT NOT NULL
          );
        `
      }).catch(() => ({ error: null }));
      
      console.log("Tables creation attempted");
    }
  } catch (e) {
    console.log("Error checking tables:", e);
  }

  // Clear existing data and insert new vehicles
  console.log("Clearing existing data...");
  await supabase.from('action_items').delete().neq('id', '');
  await supabase.from('market_listings').delete().neq('id', '');
  await supabase.from('vehicles').delete().neq('id', '');

  console.log("Inserting vehicles...");

  for (const v of VEHICLES) {
    const days = getDaysInStock(v.date_added);
    const interestCost = calcInterestCost(v.price, days);
    const status = getStatus(days);
    const discountPct = getDiscountPct(days);
    const recommendedPrice = calcRecommendedPrice(v.price, days);
    const urgencyScore = getUrgencyScore(days, v.price);
    
    const marketDelta = Math.random() * 0.1 - 0.05;
    const marketListings = [
      { source: "AutoScout24", url: "https://www.autoscout24.nl", title: v.name, price: Math.round(v.price * (0.90 + marketDelta)), year: v.year, mileage: v.mileage + 15000, location: "Rotterdam", days_online: Math.floor(Math.random() * 30) + 1, dealer: "Van der Berg Trucks" },
      { source: "Gaspedaal", url: "https://www.gaspedaal.nl", title: v.name, price: Math.round(v.price * (0.91 + marketDelta * 0.8)), year: v.year - 1, mileage: v.mileage + 28000, location: "The Hague", days_online: Math.floor(Math.random() * 40) + 1, dealer: "De Vries Used Cars" },
      { source: "Marktplaats", url: "https://www.marktplaats.nl", title: v.name, price: Math.round(v.price * (0.89 + marketDelta * 0.9)), year: v.year, mileage: v.mileage + 8000, location: "Tilburg", days_online: Math.floor(Math.random() * 20) + 1, dealer: "Hofman Vehicles" },
    ];
    const avgMarket = Math.round(marketListings.reduce((a, l) => a + l.price, 0) / marketListings.length);
    const marketDeltaPct = Math.round(((v.price - avgMarket) / avgMarket) * 100);

    const actions = [
      { type: "price_reduction", days: 30 },
      { type: "photo_update", days: 45 },
      { type: "call_prospect", days: 60 },
      { type: "export_platform", days: 90 },
    ].filter(r => days >= r.days).map((r, i) => ({
      id: `${v.id}-act-${i}`,
      vehicle_id: v.id,
      action_type: r.type,
      completed: false,
      completed_by: null,
      completed_at: null,
    }));

    const { error: vehicleError } = await supabase.from('vehicles').insert([{
      id: v.id,
      name: v.name,
      type: v.type,
      brand: v.brand,
      branch: v.branch,
      year: v.year,
      mileage: v.mileage,
      category: v.category,
      price: v.price,
      date_added: v.date_added,
      color: v.color,
      fuel_type: v.fuel_type,
      transmission: v.transmission,
      power: v.power,
      days_in_stock: days,
      status: status,
      interest_cost: interestCost,
      urgency_score: urgencyScore,
      recommended_price: recommendedPrice,
      discount_pct: discountPct,
      market_delta_pct: marketDeltaPct,
      pending_actions: actions.filter(a => !a.completed).length,
    }]);

    if (vehicleError) {
      console.error(`Error inserting ${v.id}:`, vehicleError);
    } else {
      // Insert action items
      for (const action of actions) {
        await supabase.from('action_items').insert([action]);
      }
      
      // Insert market listings
      for (const listing of marketListings) {
        await supabase.from('market_listings').insert([{
          vehicle_id: v.id,
          ...listing,
        }]);
      }
      
      console.log(`✓ ${v.name} (${v.branch})`);
    }
  }

  console.log("\n✅ Database setup complete!");
  console.log(`Total vehicles: ${VEHICLES.length}`);
}

setupDatabase().catch(console.error);