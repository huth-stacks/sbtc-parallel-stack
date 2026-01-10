/**
 * Helper utilities for the V2 UI
 *
 * These are pure utility functions - no mock data.
 */

// Helper to format BTC amounts
export function formatBtc(sats: number): string {
  return (sats / 1e8).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

// Helper to format USD amounts
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper to elide address
export function elideAddress(address: string, chars: number = 8): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Transaction status colors (using Explorer semantic tokens)
export const statusColors = {
  confirmed: {
    bg: "bg-feedback-green-100 dark:bg-feedback-green-100/20",
    text: "text-feedback-green-600 dark:text-feedback-green-500",
    dot: "bg-feedback-green-500",
  },
  pending: {
    bg: "bg-bitcoin-100 dark:bg-bitcoin-100/20",
    text: "text-bitcoin-600 dark:text-bitcoin-500",
    dot: "bg-bitcoin-500",
  },
  failed: {
    bg: "bg-feedback-red-100 dark:bg-feedback-red-100/20",
    text: "text-feedback-red-500",
    dot: "bg-feedback-red-500",
  },
};
