/**
 * Protocol Stats Bar - Wired to Production
 *
 * Displays real protocol stats from:
 * - getEmilyLimits() for caps
 * - getCurrentSbtcSupply() for supply
 * - Mempool API for BTC price
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import getEmilyLimits from "@/actions/get-emily-limits";
import getCurrentSbtcSupply from "@/actions/get-current-sbtc-supply";

const formatUsd = (value: number) => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export function ProtocolStatsBar() {
  // Fetch Emily limits (caps, available amounts)
  const { data: limits, isLoading: limitsLoading } = useQuery({
    queryKey: ["emily-limits"],
    queryFn: getEmilyLimits,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch current sBTC supply
  const { data: supplyData, isLoading: supplyLoading } = useQuery({
    queryKey: ["current-sbtc-supply"],
    queryFn: getCurrentSbtcSupply,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch BTC price
  const { data: btcPrice } = useQuery({
    queryKey: ["btc-price"],
    queryFn: async () => {
      try {
        const res = await fetch("https://mempool.space/api/v1/prices");
        const data = await res.json();
        return data.USD || 96000;
      } catch {
        return 96000;
      }
    },
    staleTime: 60000,
  });

  const isLoading = limitsLoading || supplyLoading;

  // Calculate values
  const sbtcSupply = supplyData?.value?.value
    ? Number(supplyData.value.value) / 1e8
    : 0;
  const pegCap = limits?.pegCap ? limits.pegCap / 1e8 : 0;
  const marketCap = sbtcSupply * (btcPrice || 96000);

  return (
    <div className="border-b border-explorer-border-secondary bg-surface-fourth dark:bg-surface-fourth">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-2 gap-6 overflow-x-auto">
          {/* sBTC Supply */}
          <StatItem
            label="sBTC Supply"
            value={isLoading ? "—" : `${sbtcSupply.toFixed(2)} sBTC`}
            tooltip="Current circulating sBTC supply"
          />

          {/* Market Cap */}
          <StatItem
            label="Market Cap"
            value={isLoading ? "—" : formatUsd(marketCap)}
            tooltip="sBTC market capitalization"
          />

          {/* Peg Cap */}
          <StatItem
            label="Peg Cap"
            value={isLoading ? "—" : `${pegCap.toFixed(2)} BTC`}
            tooltip="Maximum BTC that can be bridged"
          />

          {/* Per Deposit Max */}
          <StatItem
            label="Max Deposit"
            value={isLoading ? "—" : `${((limits?.perDepositCap || 0) / 1e8).toFixed(4)} BTC`}
            tooltip="Maximum per-deposit amount"
          />

          {/* Min Deposit */}
          <StatItem
            label="Min Deposit"
            value={isLoading ? "—" : `${((limits?.perDepositMinimum || 0) / 1e8).toFixed(4)} BTC`}
            tooltip="Minimum deposit amount"
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  tooltip,
  highlight = false,
}: {
  label: string;
  value: string;
  tooltip: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0 group relative" title={tooltip}>
      <span className="text-xs text-text-tertiary whitespace-nowrap">{label}</span>
      <span
        className={`text-sm font-semibold whitespace-nowrap ${
          highlight
            ? "text-feedback-green-600 dark:text-feedback-green-500"
            : "text-text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
