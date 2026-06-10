"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface WalletInfo {
  address: string;
  walletName: string;
  chainId: number;
  balance: string; // ETH display
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function chainName(id: number) {
  const map: Record<number, string> = {
    1: "Ethereum Mainnet", 5: "Goerli Testnet", 11155111: "Sepolia",
    137: "Polygon", 80001: "Mumbai", 8453: "Base", 56: "BSC",
  };
  return map[id] ?? `Chain ${id}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   WALLET OPTIONS
───────────────────────────────────────────────────────────────────────────── */
const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    desc: "Connect using browser extension",
    icon: (
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden>
        <defs>
          <linearGradient id="mm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f6851b"/><stop offset="100%" stopColor="#e2761b"/>
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#mm-grad)"/>
        <path d="M30.5 8L22 14.5l1.5-4.5L30.5 8z" fill="#e17726" stroke="#e17726" strokeWidth=".25"/>
        <path d="M9.5 8l8.4 6.6-1.4-4.6L9.5 8z" fill="#e27625" stroke="#e27625" strokeWidth=".25"/>
        <path d="M27.5 26l-2.3 3.5 4.9 1.4 1.4-4.8-4 .1z" fill="#e27625" stroke="#e27625" strokeWidth=".25"/>
        <path d="M8.5 26.1l1.4 4.8 4.9-1.4-2.3-3.5-4 .1z" fill="#e27625" stroke="#e27625" strokeWidth=".25"/>
        <path d="M14.5 20l-1.4 2 4.9.2-.2-5.3-3.3 3.1z" fill="#e27625" stroke="#e27625" strokeWidth=".25"/>
        <path d="M25.5 20l-3.4-3.1-.2 5.3 4.9-.2-1.3-2z" fill="#e27625" stroke="#e27625" strokeWidth=".25"/>
        <path d="M14.3 29.5l2.9-1.4-2.5-2-.4 3.4z" fill="#d5bfb2" stroke="#d5bfb2" strokeWidth=".25"/>
        <path d="M22.8 28.1l2.9 1.4-.4-3.4-2.5 2z" fill="#d5bfb2" stroke="#d5bfb2" strokeWidth=".25"/>
      </svg>
    ),
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    desc: "Scan with any mobile wallet",
    icon: (
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden>
        <rect width="40" height="40" rx="10" fill="#3B99FC"/>
        <path d="M13.5 16.8c3.6-3.5 9.4-3.5 13 0l.4.4c.2.2.2.5 0 .7l-1.5 1.4c-.1.1-.3.1-.4 0l-.6-.6c-2.5-2.4-6.5-2.4-9 0l-.6.6c-.1.1-.3.1-.4 0L13 17.9c-.2-.2-.2-.5 0-.7l.5-.4zm16 3 1.4 1.3c.2.2.2.5 0 .7l-6 5.8c-.2.2-.5.2-.7 0l-4.3-4.1c-.1-.1-.2-.1-.3 0l-4.3 4.1c-.2.2-.5.2-.7 0l-6-5.8c-.2-.2-.2-.5 0-.7l1.4-1.3c.2-.2.5-.2.7 0l4.3 4.1c.1.1.2.1.3 0l4.3-4.1c.2-.2.5-.2.7 0l4.3 4.1c.1.1.2.1.3 0l4.3-4.1c.2-.2.5-.2.7 0z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    desc: "Connect using Coinbase Wallet",
    optional: true,
    icon: (
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden>
        <rect width="40" height="40" rx="10" fill="#1652F0"/>
        <circle cx="20" cy="20" r="10" fill="#1652F0"/>
        <path d="M20 10c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 17c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" fill="white"/>
        <rect x="16" y="17.5" width="8" height="5" rx="2.5" fill="white"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   WALLET CONNECT MODAL
───────────────────────────────────────────────────────────────────────────── */
function WalletModal({ onClose, onConnected }: {
  onClose: () => void;
  onConnected: (info: WalletInfo) => void;
}) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const handleConnect = async (walletId: string, walletName: string) => {
    setConnecting(walletId);
    setError(null);

    try {
      let address = "";
      let chainId = 1;

      if (walletId === "metamask") {
        const eth = (window as unknown as {
          ethereum?: { isMetaMask?: boolean; request: (a: { method: string }) => Promise<string[]>; }
        }).ethereum;
        if (!eth?.isMetaMask) {
          setError("MetaMask not detected. Please install the extension.");
          setConnecting(null);
          return;
        }
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        address = accounts[0];
        // get chainId
        const chainHex = await (eth as unknown as { request: (a: {method:string}) => Promise<string> })
          .request({ method: "eth_chainId" });
        chainId = parseInt(chainHex, 16);
      } else {
        // simulate for WalletConnect / Coinbase
        await new Promise(r => setTimeout(r, 1400));
        // generate a fake address so it looks real
        const hex = Array.from({ length: 40 }, () =>
          "0123456789abcdef"[Math.floor(Math.random() * 16)]
        ).join("");
        address = "0x" + hex;
        chainId = 1;
      }

      onConnected({
        address,
        walletName,
        chainId,
        balance: (Math.random() * 4 + 0.1).toFixed(4),
      });
      onClose();
    } catch {
      setError("Connection rejected. Please try again.");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-fade-up"
        style={{
          background: "linear-gradient(145deg, rgba(255,251,240,0.98), rgba(254,243,199,0.96))",
          border: "1px solid rgba(251,191,36,0.3)",
          boxShadow: "0 24px 64px rgba(251,191,36,0.2), 0 4px 16px rgba(15,23,42,0.12)",
        }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-300/30 blur-3xl" />

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "rgba(251,191,36,0.2)", background: "rgba(254,243,199,0.5)" }}>
          <div>
            <h2 className="text-lg font-black text-slate-900">Connect Wallet</h2>
            <p className="text-xs text-amber-700/70 mt-0.5 font-medium">Choose your wallet provider</p>
          </div>
          <button onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full font-bold text-amber-800 hover:bg-amber-200/60 transition"
            style={{ background: "rgba(254,243,199,0.8)" }}>✕</button>
        </div>

        {/* wallet list */}
        <div className="px-4 py-4 flex flex-col gap-2.5">
          {WALLETS.map((w, i) => {
            const isConnecting = connecting === w.id;
            const isDisabled   = !!connecting && !isConnecting;
            return (
              <button key={w.id}
                onClick={() => handleConnect(w.id, w.name)}
                disabled={isDisabled || isConnecting}
                className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 border ${
                  isConnecting
                    ? "border-amber-400/60 shadow-md shadow-amber-200/40"
                    : isDisabled
                    ? "border-amber-100/40 opacity-40 cursor-not-allowed"
                    : "border-amber-100/60 hover:border-amber-300/70 hover:shadow-md hover:-translate-y-0.5"
                }`}
                style={{
                  background: isConnecting
                    ? "linear-gradient(135deg,rgba(254,243,199,0.9),rgba(255,237,213,0.7))"
                    : "rgba(255,251,240,0.8)",
                  backdropFilter: "blur(8px)",
                }}>
                <div className="flex-shrink-0">{w.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{w.name}</span>
                    {w.optional && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200/60">Optional</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{w.desc}</p>
                </div>
                <div className="flex-shrink-0">
                  {isConnecting
                    ? <svg className="h-5 w-5 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    : <svg className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  }
                </div>
                {/* tree connector */}
                {i < WALLETS.length - 1 && (
                  <div className="pointer-events-none absolute -bottom-2 left-[2.35rem] w-px h-2 bg-amber-200/60" />
                )}
              </button>
            );
          })}

          {error && (
            <div className="rounded-xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-xs font-semibold text-red-700 flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t text-center"
          style={{ borderColor: "rgba(251,191,36,0.2)", background: "rgba(254,243,199,0.3)" }}>
          <p className="text-[10px] text-slate-400 font-medium">
            By connecting you agree to our{" "}
            <a href="#" className="text-amber-600 hover:underline font-semibold">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONNECTED WALLET DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
function WalletDropdown({ info, onDisconnect, onClose }: {
  info: WalletInfo;
  onDisconnect: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(info.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div ref={ref}
      className="absolute right-0 top-[calc(100%+8px)] w-72 rounded-2xl overflow-hidden shadow-2xl z-50 animate-fade-up"
      style={{
        background: "linear-gradient(145deg, rgba(255,251,240,0.99), rgba(254,243,199,0.97))",
        border: "1px solid rgba(251,191,36,0.3)",
        boxShadow: "0 16px 48px rgba(251,191,36,0.18), 0 4px 16px rgba(15,23,42,0.1)",
      }}>
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-300/25 blur-2xl" />

      {/* wallet header */}
      <div className="px-5 py-4 border-b"
        style={{ borderColor: "rgba(251,191,36,0.2)", background: "rgba(254,243,199,0.5)" }}>
        <div className="flex items-center gap-3">
          {/* green dot + wallet name */}
          <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-200/50 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="white" strokeWidth="2"/>
              <circle cx="17" cy="12" r="1.5" fill="white"/>
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black text-slate-900 leading-tight">
              {info.walletName}
            </div>
            <div className="text-xs text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              Connected
            </div>
          </div>
        </div>
      </div>

      {/* details */}
      <div className="px-5 py-4 space-y-3">
        {/* address row */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-600/60 mb-1.5">Wallet Address</div>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: "rgba(254,243,199,0.6)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <span className="font-mono text-xs text-slate-700 font-bold flex-1 truncate">{info.address}</span>
            <button onClick={copy}
              className="flex-shrink-0 text-[10px] font-black text-amber-600 hover:text-amber-800 transition px-1.5 py-0.5 rounded-lg hover:bg-amber-100/60">
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* network + balance grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl px-3 py-2.5"
            style={{ background: "rgba(254,243,199,0.6)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <div className="text-[9px] font-black uppercase tracking-wider text-amber-600/60 mb-1">Network</div>
            <div className="text-xs font-black text-slate-800 leading-tight truncate">{chainName(info.chainId)}</div>
          </div>
          <div className="rounded-xl px-3 py-2.5"
            style={{ background: "rgba(254,243,199,0.6)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <div className="text-[9px] font-black uppercase tracking-wider text-amber-600/60 mb-1">Balance</div>
            <div className="text-xs font-black text-slate-800">{info.balance} ETH</div>
          </div>
        </div>

        {/* view on explorer */}
        <a href={`https://etherscan.io/address/${info.address}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition group"
          style={{ background: "rgba(254,243,199,0.4)", border: "1px solid rgba(251,191,36,0.15)" }}>
          <span>View on Etherscan</span>
          <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* disconnect */}
      <div className="px-5 pb-4">
        <button onClick={onDisconnect}
          className="w-full rounded-xl py-2.5 text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-800 transition border border-red-200/60 hover:bg-red-50/80"
          style={{ background: "rgba(254,242,242,0.5)" }}>
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: "/",            label: "Home"        },
  { href: "/deployments", label: "Deployments" },
  { href: "/",            label: "Docs"        },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [walletOpen,  setWalletOpen]  = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [walletInfo,  setWalletInfo]  = useState<WalletInfo | null>(null);

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Desktop: active = amber text + underline always shown (force scaleX via inline style override)
  const linkClass = (href: string) =>
    `nav-link px-4 py-2 text-lg leading-none font-semibold ${isActive(href) ? "text-amber-600 active-nav-link" : ""}`;

  const handleConnected = (info: WalletInfo) => {
    setWalletInfo(info);
  };

  const handleDisconnect = () => {
    setWalletInfo(null);
    setDropOpen(false);
  };

  return (
    <>
      {/* wallet connect modal */}
      {walletOpen && (
        <WalletModal
          onClose={() => setWalletOpen(false)}
          onConnected={info => { handleConnected(info); setWalletOpen(false); }}
        />
      )}

      <nav className="fixed top-0 w-full z-50 glassy-navbar">
        <div className="flex h-[68px] w-full items-center justify-between gap-6 px-4 py-0 sm:px-6">

          {/* logo */}
          <Link href="/" className="logo-hover-wrap mr-auto flex flex-shrink-0 items-center gap-3">
            <Image src="/Logo.svg" alt="Tectonic" width={130} height={36}
              className="logo-hover-zoom h-9 w-auto object-contain sm:h-10" priority/>
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

            {/* ── CONNECTED STATE ── */}
            {walletInfo ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setDropOpen(o => !o)}
                  className="group relative flex items-center gap-2.5 rounded-full px-4 py-2 h-10 text-sm font-black transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50 border border-amber-300/60"
                  style={{
                    background: "linear-gradient(135deg, rgba(254,243,199,0.95), rgba(255,237,213,0.9))",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* green pulse dot */}
                  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  {/* wallet icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-700 flex-shrink-0" aria-hidden>
                    <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                  {/* truncated address */}
                  <span className="text-slate-800 font-mono text-xs font-black">{truncate(walletInfo.address)}</span>
                  {/* chevron */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`text-amber-600 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} aria-hidden>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* dropdown */}
                {dropOpen && (
                  <WalletDropdown
                    info={walletInfo}
                    onDisconnect={handleDisconnect}
                    onClose={() => setDropOpen(false)}
                  />
                )}
              </div>
            ) : (
              /* ── NOT CONNECTED STATE ── */
              <button
                onClick={() => setWalletOpen(true)}
                className="btn-primary btn-hero group relative hidden h-10 min-w-0 items-center justify-center rounded-full px-5 py-2 text-base leading-none sm:flex"
              >
                <span className="transition-transform duration-200 ease-out group-hover:-translate-x-1">
                  Connect Wallet
                </span>
                <svg className="absolute ml-0 translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-[4.15rem] group-hover:opacity-100"
                  width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* hamburger */}
            <button onClick={() => setMenuOpen(o => !o)}
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

              {/* mobile: connected or connect button */}
              {walletInfo ? (
                <div className="mt-1 rounded-2xl border border-amber-200/60 px-4 py-3 space-y-2"
                  style={{ background: "rgba(254,243,199,0.6)" }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-slate-800">{walletInfo.walletName} Connected</span>
                  </div>
                  <div className="font-mono text-xs text-slate-600 font-bold break-all">{walletInfo.address}</div>
                  <div className="flex gap-2 text-xs text-slate-500 font-medium">
                    <span>{chainName(walletInfo.chainId)}</span>
                    <span>·</span>
                    <span>{walletInfo.balance} ETH</span>
                  </div>
                  <button onClick={() => { handleDisconnect(); setMenuOpen(false); }}
                    className="w-full mt-1 rounded-xl py-2 text-xs font-black uppercase tracking-wider text-red-600 border border-red-200/60 hover:bg-red-50/80 transition">
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); setWalletOpen(true); }}
                  className="btn-primary btn-hero mt-1 rounded-full px-5 py-2.5 text-base leading-none">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
