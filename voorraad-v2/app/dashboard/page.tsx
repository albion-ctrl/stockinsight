"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchVehicles, computeKPIs, BRANCHES } from "@/lib/data-supabase";
import { Vehicle, FilterState } from "@/types";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/ui/LangToggle";
import { KPIBar } from "@/components/dashboard/KPIBar";
import { VehicleDetail } from "@/components/dashboard/VehicleDetail";
import { Search, Filter, X, ChevronDown, ChevronRight, Truck, BarChart3, Menu, ArrowLeft, LayoutGrid, List, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { VehicleImage } from "@/components/ui/VehicleImage";

const DEMO_USER = { name: "Thomas de Vries", role: "Manager", initials: "TD" };

type ViewMode = "grid" | "list";
type GroupBy = "none" | "branch" | "brand" | "status";
type SortBy = "days" | "price" | "mileage" | "name";

export default function DashboardPage() {
  const router = useRouter();
  const { t, fmt, fmtKm } = useLang();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ branch:"all", type:"all", brand:"all", status:"all", search:"" });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [sortBy, setSortBy] = useState<SortBy>("days");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"overview" | "detail">("overview");

  const BRAND_OPTIONS = [
    ["all", t("filter.allBrands")],
    ["MAN", "MAN"],
    ["VW", "VW"],
    ["Ford", "Ford"],
    ["Renault", "Renault"],
    ["Mercedes-Benz", "Merc."],
    ["Peugeot", "Peugeot"],
    ["Citroën", "Citroën"],
    ["Toyota", "Toyota"],
    ["Škoda", "Škoda"],
    ["Opel", "Opel"],
  ] as [string, string][];

  useEffect(() => {
    fetchVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  const getFilteredVehicles = () => {
    if (!vehicles || vehicles.length === 0) return [];
    let v = [...vehicles];
    if (filters.branch !== "all") v = v.filter(x => x.branch === filters.branch);
    if (filters.type !== "all") v = v.filter(x => x.type === filters.type);
    if (filters.brand !== "all") v = v.filter(x => x.brand === filters.brand);
    if (filters.status !== "all") v = v.filter(x => x.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      v = v.filter(x =>
        x.name.toLowerCase().includes(q) ||
        x.id.toLowerCase().includes(q) ||
        x.branch.toLowerCase().includes(q)
      );
    }
    return v;
  };

  const sortedVehicles = useMemo(() => {
    const filtered = getFilteredVehicles();
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "days": return b.days_in_stock - a.days_in_stock;
        case "price": return a.price - b.price;
        case "mileage": return a.mileage - b.mileage;
        case "name": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [vehicles, filters, sortBy]);

  const groupedVehicles = useMemo(() => {
    if (groupBy === "none") return { "All Vehicles": sortedVehicles };
    
    const groups: Record<string, Vehicle[]> = {};
    sortedVehicles.forEach(v => {
      let key = "";
      switch (groupBy) {
        case "branch": key = v.branch; break;
        case "brand": key = v.brand; break;
        case "status": 
          key = v.status === "green" ? "Ready to Sell" : v.status === "amber" ? "Needs Attention" : "Urgent";
          break;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });
    return groups;
  }, [sortedVehicles, groupBy]);

  const filtered = getFilteredVehicles();
  const kpi = computeKPIs(filtered);
  const selected = vehicles.find(v => v.id === selectedId) ?? null;
  const activeFilters = [filters.branch, filters.type, filters.brand, filters.status].filter(f => f !== "all").length;

  const toggleAction = (vehicleId: string, actionId: string, completed: boolean) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v;
      const newActions = (v.action_items ?? []).map(a =>
        a.id === actionId
          ? { ...a, completed, completed_by: completed ? DEMO_USER.name : null, completed_at: completed ? new Date().toISOString() : null }
          : a
      );
      return { ...v, action_items: newActions, pending_actions: newActions.filter(a => !a.completed).length };
    }));
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedId(id);
    setMobileView("detail");
  };

  const handleBackToOverview = () => {
    setMobileView("overview");
  };

  const FilterButton = ({ value, current, onClick, label }: { value: string; current: string; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        current === value 
          ? "bg-brand text-white shadow-md" 
          : "bg-white border border-border text-muted-foreground hover:bg-secondary"
      )}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#E2E8F0]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t('general.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#E2E8F0]">
      <header className="bg-white border-b border-border flex items-center px-3 py-2 gap-2 flex-shrink-0 z-20">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-1.5 -ml-1 hover:bg-secondary rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Den Engelsen" className="h-8 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">StockInsight</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Den Engelsen Commercial Vehicles</div>
          </div>
        </div>
        <div className="hidden lg:block w-px h-5 bg-border mx-1" />
        <nav className="hidden lg:flex items-center gap-1">
          <button onClick={() => router.push('/dashboard')} className="px-3 py-1.5 text-xs font-medium text-brand bg-brand/5 rounded-md">{t('nav.dashboard')}</button>
          <button onClick={() => router.push('/reports')} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">{t('nav.reports')}</button>
          <button onClick={() => router.push('/settings')} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">{t('nav.settings')}</button>
        </nav>
        <div className="flex-1" />
        <LangToggle />
        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs font-medium">{DEMO_USER.name}</div>
            <div className="text-[10px] text-muted-foreground">{t('label.manager')} · {t('label.allBranches')}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold">
            {DEMO_USER.initials}
          </div>
        </div>
      </header>

      <KPIBar kpi={kpi} />

      <div className="flex flex-1 overflow-hidden relative">
        <main className={cn(
          "flex-1 overflow-hidden absolute lg:relative inset-0 transition-transform duration-300",
          mobileView === "overview" ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <div className="h-full flex flex-col overflow-hidden">
            <div className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border-b border-border flex-shrink-0">
              <button onClick={handleBackToOverview} className="p-1 hover:bg-secondary rounded-md">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium truncate">{t('vehicleList.selectVehicle')}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('filter.searchNew')}
                      value={filters.search}
                      onChange={e => setFilters(f => ({...f, search: e.target.value}))}
                      className="w-full pl-9 pr-9 py-2 text-sm bg-white rounded-lg border border-border outline-none focus:ring-2 focus:ring-brand/30 placeholder:text-muted-foreground shadow-sm"
                    />
                    {filters.search && (
                      <button onClick={() => setFilters(f => ({...f, search:""}))} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 bg-white rounded-lg border border-border p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn("p-1.5 rounded", viewMode === "grid" ? "bg-brand text-white" : "text-muted-foreground hover:bg-secondary")}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn("p-1.5 rounded", viewMode === "list" ? "bg-brand text-white" : "text-muted-foreground hover:bg-secondary")}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-muted-foreground">{t('filter.filterBy')}</span>
                  <button
                    onClick={() => setFilters(f => ({...f, branch: f.branch === "all" ? BRANCHES[0] : f.branch === BRANCHES[0] ? "all" : "all"}))}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      filters.branch !== "all" ? "bg-brand text-white shadow-md" : "bg-white border border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {filters.branch === "all" ? t('filter.allBranches') : filters.branch}
                  </button>
                  <button
                    onClick={() => setFilters(f => ({...f, type: f.type === "all" ? "truck" : f.type === "truck" ? "van" : f.type === "van" ? "all" : "all"}))}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      filters.type !== "all" ? "bg-brand text-white shadow-md" : "bg-white border border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {filters.type === "all" ? t('filter.allTypes') : filters.type === "truck" ? t('filter.truck') : t('filter.van')}
                  </button>
                  <button
                    onClick={() => setFilters(f => ({...f, status: f.status === "all" ? "green" : f.status === "green" ? "amber" : f.status === "amber" ? "red" : "all"}))}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      filters.status !== "all" ? "bg-brand text-white shadow-md" : "bg-white border border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {filters.status === "all" ? t('filter.allStatuses') : 
                     filters.status === "green" ? t('filter.ready') : 
                     filters.status === "amber" ? t('filter.attention') : t('filter.urgent')}
                  </button>
                  
                  {activeFilters > 0 && (
                    <button
                      onClick={() => setFilters({branch:"all",type:"all",brand:"all",status:"all",search:""})}
                      className="text-sm text-brand hover:underline"
                    >
                      {t('filter.clearAll')}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-muted-foreground">{t('filter.groupBy')}</span>
                  <select
                    value={groupBy}
                    onChange={e => setGroupBy(e.target.value as GroupBy)}
                    className="text-sm bg-white border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="none">{t('filter.noGrouping')}</option>
                    <option value="branch">{t('filter.byBranch')}</option>
                    <option value="brand">{t('filter.byBrand')}</option>
                    <option value="status">{t('filter.byStatus')}</option>
                  </select>

                  <span className="text-sm font-medium text-muted-foreground ml-4">{t('filter.sortBy')}</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortBy)}
                    className="text-sm bg-white border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="days">{t('filter.daysNewest')}</option>
                    <option value="price">{t('filter.priceLowHigh')}</option>
                    <option value="mileage">{t('filter.mileageLowHigh')}</option>
                    <option value="name">{t('filter.nameAZ')}</option>
                  </select>
                </div>

                <div className="text-sm text-muted-foreground">
                  {t('filter.showing').replace('X', String(sortedVehicles.length)).replace('Y', String(vehicles.length))}
                </div>

                <div className="space-y-6">
                  {Object.entries(groupedVehicles).map(([groupName, groupVehicles]) => (
                    <div key={groupName}>
                      {groupBy !== "none" && (
                        <div className="flex items-center gap-2 mb-3">
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-semibold">{groupName}</span>
                          <span className="text-xs text-muted-foreground">({groupVehicles.length})</span>
                        </div>
                      )}
                      
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {groupVehicles.map(v => (
                            <button
                              key={v.id}
                              onClick={() => handleVehicleSelect(v.id)}
                              className={cn(
                                "bg-white rounded-xl border border-border p-4 text-left hover:shadow-lg transition-all hover:border-brand/50",
                                selectedId === v.id && "ring-2 ring-brand border-brand"
                              )}
                            >
                              <div className="aspect-video bg-secondary rounded-lg mb-3 overflow-hidden">
                                <VehicleImage
                                  src={v.image_url}
                                  alt={v.name}
                                  brand={v.brand}
                                  type={v.type}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-sm truncate">{v.name}</h3>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    v.status === "green" && "bg-green-100 text-green-700",
                                    v.status === "amber" && "bg-amber-100 text-amber-700",
                                    v.status === "red" && "bg-red-100 text-red-700"
                                  )}>
                                    {v.days_in_stock}d
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Truck className="w-3 h-3" />
                                    {v.branch}
                                  </span>
                                  <span>·</span>
                                  <span>{v.year}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm">{fmt(v.price)}</span>
                                  <span className="text-xs text-muted-foreground">{fmtKm(v.mileage)}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {groupVehicles.map(v => (
                            <button
                              key={v.id}
                              onClick={() => handleVehicleSelect(v.id)}
                              className={cn(
                                "w-full bg-white rounded-lg border border-border p-3 text-left hover:shadow-md transition-all flex items-center gap-4",
                                selectedId === v.id && "ring-2 ring-brand border-brand"
                              )}
                            >
                              <div className="w-20 h-14 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                <VehicleImage
                                  src={v.image_url}
                                  alt={v.name}
                                  brand={v.brand}
                                  type={v.type}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-sm truncate">{v.name}</h3>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium ml-2",
                                    v.status === "green" && "bg-green-100 text-green-700",
                                    v.status === "amber" && "bg-amber-100 text-amber-700",
                                    v.status === "red" && "bg-red-100 text-red-700"
                                  )}>
                                    {v.days_in_stock}d
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <span>{v.branch}</span>
                                  <span>·</span>
                                  <span>{v.year}</span>
                                  <span>·</span>
                                  <span>{fmtKm(v.mileage)}</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-bold">{fmt(v.price)}</div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {sortedVehicles.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Truck className="w-16 h-16 opacity-20 mb-4" />
                    <p className="text-lg font-medium">{t('filter.noVehicles')}</p>
                    <p className="text-sm">{t('filter.adjustFilters')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <main className={cn(
          "flex-1 overflow-hidden absolute lg:relative inset-0 transition-transform duration-300",
          mobileView === "detail" ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          {selected ? (
            <div className="h-full flex flex-col">
              <div className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border-b border-border flex-shrink-0">
                <button onClick={handleBackToOverview} className="p-1 hover:bg-secondary rounded-md">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium truncate">{selected.name}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <VehicleDetail vehicle={selected} onToggleAction={toggleAction} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">{t('vehicleList.selectVehicle')}</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-in slide-in-from-left">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="text-sm font-semibold">Menu</div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-2">
              <button 
                onClick={() => { router.push('/dashboard'); setMobileMenuOpen(false); }} 
                className="w-full text-left px-3 py-2 text-sm font-medium text-brand bg-brand/5 rounded-md"
              >
                {t('nav.dashboard')}
              </button>
              <button 
                onClick={() => { router.push('/reports'); setMobileMenuOpen(false); }} 
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
              >
                {t('nav.reports')}
              </button>
              <button 
                onClick={() => { router.push('/settings'); setMobileMenuOpen(false); }} 
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
              >
                {t('nav.settings')}
              </button>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold">
                  {DEMO_USER.initials}
                </div>
                <div>
                  <div className="text-sm font-medium">{DEMO_USER.name}</div>
                  <div className="text-xs text-muted-foreground">{DEMO_USER.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
