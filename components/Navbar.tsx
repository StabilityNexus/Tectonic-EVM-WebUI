"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useTranslations } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/deployments", label: "Deployments" },
  { href: "#docs",        label: "Docs"        },
];

function CustomConnectButton() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { address, connector } = useAccount();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

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
                    className="btn-primary btn-hero group relative flex h-10 items-center justify-center rounded-full px-5 hover:pl-4 hover:pr-9 text-base leading-none transition-all duration-300 ease-out whitespace-nowrap shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40"
                  >
                    <span>
                      {t("connectWallet", { defaultValue: "Connect Wallet" })}
                    </span>
                    <svg className="absolute right-3.5 opacity-0 -translate-x-2 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                      width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="btn-primary btn-hero h-10 rounded-full px-5 text-sm font-bold !bg-red-500 hover:!bg-red-600 shadow-md">
                    {t("wrongNetwork", { defaultValue: "Wrong network" })}
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      type="button"
                      className="group relative flex items-center gap-2.5 rounded-full px-4 py-2 h-10 text-sm font-black transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50 border border-amber-300/60 shadow-sm"
                      style={{
                        background: "linear-gradient(135deg, rgba(254,243,199,0.95), rgba(255,237,213,0.9))",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <span className="text-slate-800 font-mono text-xs font-black">{account.displayName}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`text-amber-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} aria-hidden>
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Custom Dropdown */}
                    <div className={`absolute right-0 mt-2 w-72 rounded-2xl border border-amber-200/60 bg-white/95 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 origin-top-right transition-all duration-200 ease-out ${dropdownOpen ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}`}>
                      <div className="mb-4 border-b border-amber-100 pb-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em] mb-1.5">{t("wallet", { defaultValue: "Wallet" })}</p>
                          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {connector?.name || 'Connected Wallet'}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 border-b border-amber-100 pb-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em] mb-1.5">{t("network", { defaultValue: "Network" })}</p>
                          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {chain.hasIcon && chain.iconUrl && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={chain.iconUrl} alt={chain.name ?? 'Network'} className="w-5 h-5 rounded-full" />
                            )}
                            {chain.name}
                          </p>
                        </div>
                        <button type="button" onClick={() => { setDropdownOpen(false); openChainModal(); }} className="text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/50 transition-colors">{t("switch", { defaultValue: "Switch" })}</button>
                      </div>
                      <div className="mb-4 border-b border-amber-100 pb-4">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em] mb-1.5">{t("connectedAddress", { defaultValue: "Connected Address" })}</p>
                        <p className="text-sm font-mono font-bold text-slate-800 break-all bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {address}
                        </p>
                      </div>
                      <div className="mb-5">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em] mb-1.5">{t("availableBalance", { defaultValue: "Available Balance" })}</p>
                        <p className="text-2xl font-black text-slate-900">
                          {account.displayBalance}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          disconnect();
                          setDropdownOpen(false);
                        }}
                        className="w-full rounded-xl bg-red-50 py-3 text-sm font-black text-red-600 transition-colors hover:bg-red-100 border border-red-100 flex items-center justify-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

  return (
    <nav className="fixed top-0 w-full z-50 glassy-navbar">
      <div className="flex h-[68px] w-full items-center justify-between gap-6 px-4 py-0 sm:px-6">

        {/* logo */}
        <Link href="/" className="logo-hover-wrap mr-auto flex flex-shrink-0 items-center gap-3">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Logo.svg`}
            alt="Tectonic"
            width={130}
            height={36}
            className="logo-hover-zoom h-9 w-auto object-contain sm:h-10"
            priority
          />
          <span className="hidden text-xl leading-none font-extrabold tracking-[0.22em] text-slate-900 sm:block">
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
          <a href="https://github.com/StabilityNexus/Tectonic-EVM-WebUI" target="_blank" rel="noopener noreferrer"
            className="nav-link px-4 py-2 text-lg leading-none font-semibold">Github</a>
        </div>

        {/* right: wallet button */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-3">
          
          <div className="hidden sm:block">
            <CustomConnectButton />
          </div>

          {/* hamburger */}
          <button type="button" onClick={() => setMenuOpen(o => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-slate-100 md:hidden"
            aria-label="Menu" aria-expanded={menuOpen}>
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}/>
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}/>
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}/>
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-amber-100 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(item =>
              item.href.startsWith("#")
                ? <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-lg leading-none font-semibold transition ${isActive(item.href) ? "bg-amber-50 text-amber-700" : "text-slate-700 hover:bg-amber-50 hover:text-amber-700"}`}>
                    {item.label}
                  </a>
                : <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-lg leading-none font-semibold transition ${isActive(item.href) ? "bg-amber-50 text-amber-700" : "text-slate-700 hover:bg-amber-50 hover:text-amber-700"}`}>
                    {item.label}
                  </Link>
            )}
            <a href="https://github.com/StabilityNexus/Tectonic-EVM-WebUI" target="_blank" rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-lg leading-none font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition">
              Github
            </a>

            <div className="mt-3 flex justify-center">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
