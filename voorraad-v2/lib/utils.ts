import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEuro(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency: "EUR",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

export function formatKm(n: number): string {
  if (n === 0) return "New";
  return `${new Intl.NumberFormat("en-GB").format(n)} km`;
}

export function formatNum(n: number): string {
  return new Intl.NumberFormat("en-GB").format(n);
}

export function getDaysInStock(dateAdded: string): number {
  const added = new Date(dateAdded);
  const now = new Date();
  return Math.floor((now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStatus(days: number): "green" | "amber" | "red" {
  if (days < 30) return "green";
  if (days <= 45) return "amber";
  return "red";
}

export function getUrgencyScore(days: number, price: number, interestRate = 0.055): number {
  const dailyInterest = (price * interestRate) / 365;
  const totalInterest = dailyInterest * days;
  const daysWeight = days > 90 ? 3 : days > 60 ? 2 : days > 45 ? 1.5 : days > 30 ? 1 : 0.5;
  return Math.round(totalInterest * daysWeight);
}

export function calcInterestCost(price: number, days: number, rate = 0.055): number {
  return Math.round((price * rate * days) / 365);
}

export function calcRecommendedPrice(price: number, days: number): number {
  if (days >= 90) return Math.round(price * 0.94);
  if (days >= 45) return Math.round(price * 0.96);
  if (days >= 30) return Math.round(price * 0.98);
  return price;
}

export function getDiscountPct(days: number): number {
  if (days >= 90) return 6;
  if (days >= 45) return 4;
  if (days >= 30) return 2;
  return 0;
}
