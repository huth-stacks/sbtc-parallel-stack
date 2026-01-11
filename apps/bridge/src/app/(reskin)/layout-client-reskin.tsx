/**
 * Reskin Layout Client Component
 *
 * Modern layout matching the Explorer design system.
 */
"use client";

import { Toaster } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import { useState, useEffect } from "react";
import { walletInfoAtom, showConnectWalletAtom, themeAtom } from "@/util/atoms";
import ConnectWallet from "@/comps/ConnectWallet";
import { ProtocolStatsBar } from "./components/protocol-stats-bar";
import { ThemeToggler } from "./components/header/theme-toggler";

export default function LayoutClientReskin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  const theme = useAtomValue(themeAtom);
  const walletInfo = useAtomValue(walletInfoAtom);
  const [showConnectWallet, setShowConnectWallet] = useAtom(showConnectWalletAtom);

  // Format wallet address for display
  const displayAddress = walletInfo?.addresses?.stacks?.address
    ? `${walletInfo.addresses.stacks.address.slice(0, 6)}...${walletInfo.addresses.stacks.address.slice(-4)}`
    : null;

  if (!loaded) return null;

  return (
    <div className={theme}>
      <div className="min-h-screen bg-surface-tertiary dark:bg-surface-tertiary">
        {/* Header */}
        <header className="border-b border-explorer-border-secondary bg-surface-fourth dark:bg-surface-fourth">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sand-700 dark:bg-sand-100 flex items-center justify-center">
                <span className="text-sand-50 dark:text-sand-1000 font-bold text-sm">
                  S
                </span>
              </div>
              <span className="font-semibold text-text-primary">
                sBTC Bridge
              </span>
            </Link>

            {/* Wallet Connection */}
            <div className="flex items-center gap-3">
              <ThemeToggler />
              {walletInfo?.selectedWallet ? (
                <button
                  onClick={() => setShowConnectWallet(true)}
                  className="px-4 py-2 rounded-lg bg-sand-700 dark:bg-sand-100 text-sand-50 dark:text-sand-1000 font-medium text-sm hover:bg-sand-800 dark:hover:bg-sand-200 transition-colors"
                >
                  {displayAddress}
                </button>
              ) : (
                <button
                  onClick={() => setShowConnectWallet(true)}
                  className="px-4 py-2 rounded-lg bg-stacks-500 text-white font-medium text-sm hover:bg-stacks-600 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Protocol Stats Bar */}
        <ProtocolStatsBar />

        {/* Navigation */}
        <nav className="border-b border-explorer-border-secondary bg-surface-fourth dark:bg-surface-fourth">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-1">
              <NavLink href="/" label="Deposit" exact />
              <NavLink href="/withdraw" label="Withdraw" />
              <NavLink href="/history" label="History" />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Connect Wallet Modal */}
        {showConnectWallet && (
          <ConnectWallet onClose={() => setShowConnectWallet(false)} />
        )}

        {/* Toast Container */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "bg-surface-fourth border border-explorer-border-secondary shadow-lg",
            style: {
              background: "var(--surface-fourth)",
              border: "1px solid var(--border-secondary)",
              color: "var(--text-primary)",
            },
          }}
        />
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  exact = false,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        px-4 py-3 text-sm font-medium border-b-2 transition-colors
        ${isActive
          ? "border-stacks-500 text-text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary hover:border-sand-300"
        }
      `}
    >
      {label}
    </Link>
  );
}
