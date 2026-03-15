"use client";
import { useRouter } from "next/navigation";
import { Truck, BarChart3, Settings, ChevronLeft, Download, Calendar } from "lucide-react";

const DEMO_USER = { name: "Thomas de Vries", role: "Manager", initials: "TD" };

export default function ReportsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      <header className="bg-white border-b border-border flex items-center px-4 py-2.5 gap-3">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white font-bold text-xs">DE</div>
          <div>
            <div className="text-sm font-semibold leading-tight">StockInsight</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Den Engelsen Commercial Vehicles</div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-medium">{DEMO_USER.name}</div>
            <div className="text-[10px] text-muted-foreground">{DEMO_USER.role} · All branches</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold">
            {DEMO_USER.initials}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">Reports</h1>
        
        <div className="grid gap-4">
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Monthly Stock Report</h2>
                <p className="text-xs text-muted-foreground">Overview of inventory performance</p>
              </div>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-secondary rounded-md hover:bg-secondary/80">March 2026</button>
              <button className="px-3 py-1.5 text-xs bg-secondary rounded-md hover:bg-secondary/80">February 2026</button>
              <button className="px-3 py-1.5 text-xs bg-secondary rounded-md hover:bg-secondary/80">January 2026</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Interest Cost Analysis</h2>
                <p className="text-xs text-muted-foreground">Financial impact of inventory holding</p>
              </div>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Total interest cost MTD: €12,450</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Branch Performance</h2>
                <p className="text-xs text-muted-foreground">Performance by location</p>
              </div>
              <Truck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {['Duiven', 'Eindhoven', 'Nijmegen', 'Venlo', 'Stein', 'Tiel'].map(branch => (
                <div key={branch} className="flex items-center justify-between text-xs">
                  <span>{branch}</span>
                  <span className="text-muted-foreground">View details →</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Export Data</h2>
                <p className="text-xs text-muted-foreground">Download reports as CSV or PDF</p>
              </div>
              <Download className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs brand-gradient text-white rounded-md">Export CSV</button>
              <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-secondary">Export PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}