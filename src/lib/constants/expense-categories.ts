import type { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  ShoppingBasket,
  Car,
  BedDouble,
  Clapperboard,
  ShoppingBag,
  ReceiptText,
  Plane,
  HeartPlus,
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
    color: { icon: "text-category-food", bg: "bg-category-food/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "groceries",
    label: "Groceries",
    icon: ShoppingBasket,
    color: { icon: "text-category-groceries", bg: "bg-category-groceries/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "transport",
    label: "Transport",
    icon: Car,
    color: { icon: "text-category-transport", bg: "bg-category-transport/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "stay",
    label: "Stay",
    icon: BedDouble,
    color: { icon: "text-category-stay", bg: "bg-category-stay/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "fun",
    label: "Fun",
    icon: Clapperboard,
    color: { icon: "text-category-fun", bg: "bg-category-fun/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    color: { icon: "text-category-shopping", bg: "bg-category-shopping/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "bills-utilities",
    label: "Bills & Utilities",
    icon: ReceiptText,
    color: { icon: "text-category-bills", bg: "bg-category-bills/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "travel",
    label: "Travel",
    icon: Plane,
    color: { icon: "text-category-travel", bg: "bg-category-travel/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "health",
    label: "Health",
    icon: HeartPlus,
    color: { icon: "text-category-health", bg: "bg-category-health/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    value: "other",
    label: "Other",
    icon: Tag,
    color: { icon: "text-category-other", bg: "bg-category-other/10" },
    // color: { icon: "text-primary", bg: "bg-primary/10" },
  },
];

export function getExpenseCategory(value: string) {
  return EXPENSE_CATEGORIES.find((category) => category.value === value);
}
