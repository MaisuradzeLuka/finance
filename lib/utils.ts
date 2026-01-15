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
