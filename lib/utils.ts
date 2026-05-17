// lib/utils.ts

// Combines CSS utility string layouts dynamically
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Converts numeric parameters directly to standard formatted currency outputs
export function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

// Truncates text inputs cleanly across grid system preview components
export function truncateText(text: string, maximumCharactersLength: number) {
  if (text.length <= maximumCharactersLength) return text;
  return `${text.slice(0, maximumCharactersLength)}...`;
}