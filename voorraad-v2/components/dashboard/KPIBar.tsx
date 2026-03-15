"use client";
import { KPISnapshot } from "@/types";
import { formatEuro, cn } from "@/lib/utils";
import { AlertCircle, TrendingDown, Clock, Package, Euro, BarChart3 } from "lucide-react";

interface Props { kpi: KPISnapshot; }

export function KPIBar({ kpi }: Props) {
  const items = [
    {
      icon: <Package className="w-4 h-4" />,
      label: "Total vehicles",
      value: String(kpi.total_vehicles),
      color: "text-foreground",
      bg: "bg-secondary/60",
      border: "border-transparent",
    },
    {
      icon: <Euro className="w-4 h-4" />,
      label: "Total interest cost",
      value: formatEuro(kpi.total_interest_cost),
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      bold: true,
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Action required (>45d)",
      value: String(kpi.needs_action),
      color: kpi.needs_action > 0 ? "text-amber-700" : "text-emerald-700",
      bg: kpi.needs_action > 0 ? "bg-amber-50" : "bg-emerald-50",
      border: kpi.needs_action > 0 ? "border-amber-100" : "border-emerald-100",
    },
    {
      icon: <TrendingDown className="w-4 h-4" />,
      label: "Critical (>90d)",
      value: String(kpi.critical),
      color: kpi.critical > 0 ? "text-red-700" : "text-emerald-700",
      bg: kpi.critical > 0 ? "bg-red-50" : "bg-emerald-50",
      border: kpi.critical > 0 ? "border-red-100" : "border-emerald-100",
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: "Average days in stock",
      value: `${kpi.avg_days} days`,
      color: "text-foreground",
      bg: "bg-secondary/60",
      border: "border-transparent",
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: "Above market average",
      value: `+${kpi.avg_market_delta}%`,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
  ];

  return (
    <div className="bg-white border-b border-border px-4 py-2.5 flex-shrink-0">
      <div className="flex items-center gap-2 overflow-x-auto thin-scroll pb-0.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <div className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg border",
              item.bg, item.border
            )}>
              <span className={cn("flex-shrink-0", item.color)}>{item.icon}</span>
              <div>
                <div className="text-xs text-muted-foreground leading-tight whitespace-nowrap">{item.label}</div>
                <div className={cn(
                  "text-base leading-tight interest-counter",
                  item.color, item.bold && "font-semibold"
                )}>{item.value}</div>
              </div>
            </div>
            {i < items.length - 1 && <div className="w-px h-8 bg-border flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
