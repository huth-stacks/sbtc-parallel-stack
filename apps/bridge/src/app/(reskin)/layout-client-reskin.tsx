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
        {/* Header with Navigation */}
        <header className="border-b border-explorer-border-secondary bg-surface-fourth dark:bg-surface-fourth">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo + Navigation */}
            <div className="flex items-center gap-4 md:gap-8">
              <Link href="/" className="flex items-center gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-sand-800 dark:bg-sand-200 flex items-center justify-center">
                  <span className="text-white dark:text-sand-900 font-bold text-sm">
                    S
                  </span>
                </div>
                <span className="font-semibold text-sand-900 dark:text-sand-100 text-sm md:text-base">
                  sBTC Bridge
                </span>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden sm:flex items-center gap-1">
                <NavLink href="/" label="Deposit" exact />
                <NavLink href="/withdraw" label="Withdraw" />
                <NavLink href="/history" label="History" />
              </nav>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggler />
              {walletInfo?.selectedWallet ? (
                <button
                  onClick={() => setShowConnectWallet(true)}
                  className="px-3 md:px-4 py-2 rounded-lg bg-sand-800 dark:bg-sand-200 text-white dark:text-sand-900 font-medium text-xs md:text-sm hover:bg-sand-900 dark:hover:bg-sand-300 transition-colors"
                >
                  {displayAddress}
                </button>
              ) : (
                <button
                  onClick={() => setShowConnectWallet(true)}
                  className="px-3 md:px-4 py-2 rounded-lg bg-stacks-500 text-white font-medium text-xs md:text-sm hover:bg-stacks-600 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="sm:hidden border-t border-explorer-border-secondary">
            <div className="flex justify-center gap-1 px-4">
              <NavLink href="/" label="Deposit" exact />
              <NavLink href="/withdraw" label="Withdraw" />
              <NavLink href="/history" label="History" />
            </div>
          </nav>
        </header>

        {/* Protocol Stats Bar */}
        <ProtocolStatsBar />

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
        px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive
          ? "bg-sand-100 dark:bg-sand-800 text-sand-900 dark:text-sand-100"
          : "text-sand-500 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 hover:bg-sand-50 dark:hover:bg-sand-800/50"
        }
      `}
    >
      {label}
    </Link>
  );
}
