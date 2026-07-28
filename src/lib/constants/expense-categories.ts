import type { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  ShoppingBasket,
  Car,
  BedDouble,
  Clapperboard,
  ShoppingBag,
  Receipt,
  Plane,
  HeartPulse,
  Tag,
} from "lucide-react";

export type ExpenseCategory = {
  value: string;
  label: string;
  icon: LucideIcon;
  color: {
    icon: string;
    bg: string;
  };
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    value: "food-drink",
    label: "Food & Drink",
    icon: UtensilsCrossed,
    color: { icon: "text-amber-600", bg: "bg-amber-500/15" },
  },
  {
    value: "groceries",
    label: "Groceries",
    icon: ShoppingBasket,
    color: { icon: "text-green-600", bg: "bg-green-500/15" },
  },
  {
    value: "transport",
    label: "Transport",
    icon: Car,
    color: { icon: "text-blue-600", bg: "bg-blue-500/15" },
  },
  {
    value: "stay",
    label: "Stay",
    icon: BedDouble,
    color: { icon: "text-violet-600", bg: "bg-violet-500/15" },
  },
  {
    value: "fun",
    label: "Fun",
    icon: Clapperboard,
    color: { icon: "text-pink-600", bg: "bg-pink-500/15" },
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    color: { icon: "text-orange-600", bg: "bg-orange-500/15" },
  },
  {
    value: "bills-utilities",
    label: "Bills & Utilities",
    icon: Receipt,
    color: { icon: "text-slate-600", bg: "bg-slate-500/15" },
  },
  {
    value: "travel",
    label: "Travel",
    icon: Plane,
    color: { icon: "text-sky-600", bg: "bg-sky-500/15" },
  },
  {
    value: "health",
    label: "Health",
    icon: HeartPulse,
    color: { icon: "text-rose-600", bg: "bg-rose-500/15" },
  },
  {
    value: "other",
    label: "Other",
    icon: Tag,
    color: { icon: "text-gray-600", bg: "bg-gray-500/15" },
  },
];

export function getExpenseCategory(value: string) {
  return EXPENSE_CATEGORIES.find((category) => category.value === value);
}
