import React from "react";
import { 
  Utensils, Home, Car, ShoppingCart, Gift, 
  TrendingUp, TrendingDown, DollarSign, 
  Briefcase, CreditCard, ShoppingBag, 
  Film, Wifi, Heart, Activity, PiggyBank,
  Coffee, ShieldAlert, Sparkles, AlertCircle
} from "lucide-react";

export interface ColorClass {
  bg: string;
  text: string;
  border: string;
  ring: string;
  button: string;
  iconBg: string;
}

export const GAUGE_COLORS: Record<string, { gradientStart: string; gradientEnd: string; text: string; bg: string }> = {
  Income: { 
    gradientStart: '#18181b', // neutral
    gradientEnd: '#27272a',
    text: 'text-text-app',
    bg: 'bg-surface-app'
  },
  Spent: { 
    gradientStart: '#18181b',
    gradientEnd: '#27272a',
    text: 'text-text-app',
    bg: 'bg-surface-app'
  },
  Savings: { 
    gradientStart: '#18181b',
    gradientEnd: '#27272a',
    text: 'text-text-app',
    bg: 'bg-surface-app'
  }
};

// General chart colors (pie chart sectors) - Luxury Fintech palette
export const COLORS = [
  '#C5A059', // Muted Gold
  '#78716C', // Warm Slate / Taupe
  '#5E7A68', // Muted Forest Green
  '#9B5B57', // Muted Burgundy / Rust
  '#8E8E8A', // Muted Slate
  '#A38B75', // Warm Tan
  '#967A4F'  // Antique Bronze
];

export const INCOME_COLORS = [
  '#C5A059', '#D4AF37', '#A38B75', '#B89047', '#967A4F'
];

export const CATEGORY_ICONS_Inc: Record<string, React.ReactNode> = {
  Salary: <Briefcase className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Freelance: <Sparkles className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Investment: <TrendingUp className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Bonus: <Gift className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Other: <DollarSign className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />
};

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Housing: <Home className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Transport: <Car className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Shopping: <ShoppingCart className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Entertainment: <Film className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Utilities: <Wifi className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Healthcare: <Heart className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Salary: <Briefcase className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Freelance: <Sparkles className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Savings: <PiggyBank className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Other: <DollarSign className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />
};

export const INCOME_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Salary: <Briefcase className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Freelance: <Sparkles className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Investment: <TrendingUp className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Bonus: <Gift className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Other: <DollarSign className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
};

export const EXPENSE_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Housing: <Home className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Transport: <Car className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Shopping: <ShoppingBag className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Entertainment: <Film className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Utilities: <Wifi className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Healthcare: <Heart className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
  Other: <ShoppingCart className="w-4 h-4 text-zinc-550 dark:text-zinc-400" />,
};

export const colorClasses: Record<string, ColorClass> = {
  income: {
    bg: "bg-surface-app",
    text: "text-text-app",
    border: "border-border-app",
    ring: "ring-zinc-400",
    button: "bg-text-app text-bg-app hover:opacity-90",
    iconBg: "bg-surface-app text-text-app border border-border-app",
  },
  expense: {
    bg: "bg-surface-app",
    text: "text-text-app",
    border: "border-border-app",
    ring: "ring-zinc-400",
    button: "bg-text-app text-bg-app hover:opacity-90",
    iconBg: "bg-surface-app text-text-app border border-border-app",
  },
};
