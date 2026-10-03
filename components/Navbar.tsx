"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useTranslations } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/deployments", label: "Deployments" },
  { href: "#docs", label: "Docs" },
];

/* --- TYPES --- */
interface CustomConnectButtonProps {
  variant?: "desktop" | "mobile";
}

function CustomConnectButton({ variant = "desktop" }: CustomConnectButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { address, connector } = useAccount();
  const { data: balanceData, isError, isLoading } = useBalance({ address });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");
  const isMobile = variant === "mobile";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            className={isMobile ? "w-full" : undefined}
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={
                      isMobile
                        ? "btn-primary btn-hero group relative flex h-11 w-full min-w-0 items-center justify-center rounded-full px-5 text-sm leading-none transition-all duration-300 ease-out whitespace-nowrap shadow-md shadow-amber-500/20"
                        : "btn-primary btn-hero group relative flex h-10 w-auto items-center justify-center rounded-full px-5 hover:pl-4 hover:pr-9 text-base leading-none transition-all duration-300 ease-out whitespace-nowrap shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40"
                    }
                  >
                    <span>
                      {t("connectWallet", { defaultValue: "Connect Wallet" })}
                    </span>
                    {!isMobile && (
                      <svg className="absolute right-3.5 opacity-0 -translate-x-2 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                        width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              }

              const networkSelectorButton = (
                <button
                  onClick={openChainModal}
                  type="button"
                  className={
                    isMobile
                      ? "flex h-11 w-full min-w-0 items-center gap-2.5 rounded-full border border-amber-300/60 px-4 text-sm font-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50"
                      : "flex h-10 w-auto items-center gap-2 rounded-full border border-amber-300/60 px-4 py-2 text-sm font-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50"
                  }
                  style={{
                    background: "linear-gradient(135deg, rgba(254,243,199,0.95), rgba(255,237,213,0.9))",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {chain.hasIcon && chain.iconUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={chain.iconUrl} alt={chain.name ?? t("network", { defaultValue: "Network" })} className="h-5 w-5 flex-shrink-0 rounded-full" />
                  ) : (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-[10px] font-black text-amber-800" aria-hidden>
                      N
                    </span>
                  )}
                  <span className={`min-w-0 flex-1 truncate font-mono text-xs font-black text-slate-800 ${isMobile ? "text-left" : ""}`}>
                    {chain.name ?? t("wrongNetwork", { defaultValue: "Wrong Network" })}
                  </span>
                  {isMobile && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-amber-700" aria-hidden>
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );

              if (chain.unsupported) {
                return (
                  <div className={`flex ${isMobile ? "w-full flex-col gap-2.5" : "w-auto flex-row flex-wrap items-center justify-center gap-3"}`}>
                    {networkSelectorButton}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className={`btn-primary btn-hero h-11 rounded-full px-5 text-sm font-bold !bg-red-500 hover:!bg-red-600 shadow-md whitespace-nowrap min-w-0 ${isMobile ? "w-full" : "w-auto h-10"}`}
                    >
                      {t("wrongNetwork", { defaultValue: "Wrong network" })}
                    </button>
                  </div>
                );
              }

              return (
                <div className={`flex ${isMobile ? "w-full flex-col gap-2.5" : "w-auto flex-row flex-wrap items-center justify-center gap-3"}`}>
                  {networkSelectorButton}
                  <div className={`relative ${isMobile ? "w-full" : "w-auto"}`} ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      type="button"
                      className={
                        isMobile
                          ? "group relative flex h-11 w-full min-w-0 items-center gap-2.5 rounded-full border border-amber-300/60 px-4 text-sm font-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50"
                          : "group relative flex h-10 w-auto items-center gap-2.5 rounded-full border border-amber-300/60 px-4 py-2 text-sm font-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50 whitespace-nowrap"
                      }
                      style={{
                        background: "linear-gradient(135deg, rgba(254,243,199,0.95), rgba(255,237,213,0.9))",
                        backdropFilter: "blur(8px)",
                      }}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="menu"
                    >
                      <span className={`min-w-0 flex-1 truncate font-mono text-xs font-black text-slate-800 ${isMobile ? "text-left" : ""}`}>
                        {account.displayName}
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`flex-shrink-0 text-amber-600 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Custom Dropdown — constrained to viewport on mobile */}
                    <div
                      role="menu"
                      className={[
                        "absolute z-50 origin-top-right rounded-2xl border border-amber-200/60 bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 ease-out sm:p-5",
                        isMobile
                          ? "left-0 right-0 mt-2 w-full max-w-full"
                          : "right-0 mt-2 w-72 max-w-[calc(100vw-2rem)]",
                        dropdownOpen
                          ? "visible translate-y-0 scale-100 opacity-100 pointer-events-auto"
                          : "invisible -translate-y-2 scale-95 opacity-0 pointer-events-none",
                      ].join(" ")}
                    >
                      <div className="mb-4 flex items-center justify-between border-b border-amber-100 pb-4">
                        <div className="min-w-0">
                          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-amber-500">
                            {t("wallet", { defaultValue: "Wallet" })}
                          </p>
                          <p className="truncate text-sm font-bold text-slate-800">
                            {connector?.name || "Connected Wallet"}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 border-b border-amber-100 pb-4">
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-amber-500">
                          {t("connectedAddress", { defaultValue: "Connected Address" })}
                        </p>
                        <p className="break-all rounded-lg border border-slate-100 bg-slate-50 p-2.5 font-mono text-sm font-bold text-slate-800">
                          {account.address}
                        </p>
                      </div>
                      <div className="mb-5">
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-amber-500">
                          {t("availableBalance", { defaultValue: "Available Balance" })}
                        </p>
                        <div className="text-2xl font-black text-slate-900">
                          {account.displayBalance ? (
                            account.displayBalance
                          ) : isLoading ? (
                            <span className="text-sm font-medium tracking-normal text-slate-500">Loading...</span>
                          ) : isError ? (
                            <span className="text-sm font-medium tracking-normal text-red-500">Error fetching balance</span>
                          ) : balanceData ? (
                            `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
                          ) : (
                            <span className="text-sm font-medium tracking-normal text-slate-500">Unavailable</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          disconnect();
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-black text-red-600 transition-colors hover:bg-red-100"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        {t("disconnectWallet", { defaultValue: "Disconnect Wallet" })}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    `nav-link px-4 py-2 text-lg leading-none font-semibold ${isActive(href) ? "text-amber-600 active-nav-link" : ""}`;

  const mobileLinkClass = (href: string) =>
    `flex w-full items-center rounded-xl px-3.5 py-3 text-base font-semibold leading-none transition ${
      isActive(href)
        ? "bg-amber-50 text-amber-700"
        : "text-slate-700 hover:bg-amber-50 hover:text-amber-700"
    }`;

  // Prevent background scroll while mobile drawer is open
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <nav className="glassy-navbar fixed top-0 z-50 w-full">
      {/* Top bar — logo + desktop links + wallet/hamburger */}
      <div className="flex h-[68px] w-full flex-shrink-0 items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="logo-hover-wrap mr-auto flex flex-shrink-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Logo.svg`}
            alt="Tectonic"
            width={130}
            height={36}
            className="logo-hover-zoom h-9 w-auto object-contain sm:h-10"
            style={{ width: "auto" }}
            priority
          />
          <span className="hidden text-xl leading-none font-black tracking-[0.04em] bg-gradient-to-b from-[#c38b44] to-[#7e4420] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] sm:block">
            TECTONIC
          </span>
        </Link>

        {/* desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(item =>
            item.href.startsWith("#")
              ? <a key={item.label} href={item.href} className={linkClass(item.href)}>{item.label}</a>
              : <Link key={item.label} href={item.href} className={linkClass(item.href)}>{item.label}</Link>
          )}
          <a
            href="https://github.com/StabilityNexus/Tectonic-EVM-WebUI"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link px-4 py-2 text-lg leading-none font-semibold"
          >
            Github
          </a>
        </div>

        <div className="ml-auto flex flex-shrink-0 items-center gap-3">
          <div className="hidden md:block">
            <CustomConnectButton variant="desktop" />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            className={`flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-slate-100 md:hidden ${menuOpen ? "bg-slate-100" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
          >
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer — single-column stack below header */}
      {menuOpen && (
        <div
          id="mobile-nav-drawer"
          className="w-full border-t border-amber-100/80 bg-white/97 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
        >
          <div className="flex w-full flex-col px-4 pb-5 pt-3 sm:px-5">
            {/* Navigation links */}
            <div className="flex flex-col gap-1.5 py-1">
              {NAV_ITEMS.map(item =>
                item.href.startsWith("#")
                  ? (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass(item.href)}
                    >
                      {item.label}
                    </a>
                  )
                  : (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass(item.href)}
                    >
                      {item.label}
                    </Link>
                  )
              )}
              <a
                href="https://github.com/StabilityNexus/Tectonic-EVM-WebUI"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center rounded-xl px-3.5 py-3 text-base font-semibold leading-none text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
              >
                Github
              </a>
            </div>

            {/* Wallet / network */}
            <div className="mt-3 border-t border-amber-100 pt-4">
              <CustomConnectButton variant="mobile" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
