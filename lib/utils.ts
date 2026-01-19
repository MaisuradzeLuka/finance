import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAmountNegative(amount: number) {
  return amount <= 0 ? true : false;
}

export function convertToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertFromMiliunits(amount: number) {
  return amount / 1000;
}

export function formatAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function formatMonthYear(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function calculateChange(lastPeriod: number, currentPeriod: number) {
  if (lastPeriod === 0) {
    return currentPeriod === 0 ? 0 : 100;
  }
  return Math.round(((currentPeriod - lastPeriod) / lastPeriod) * 100);
}
