"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

/*
  THEME: matches homepage exactly
  --primary:      #fbbf24  (amber-400)
  --primary-dark: #f59e0b  (amber-500)
  background:     #ffffff / #fbf6ec (warm off-white sections)
  card border:    #e7dac4
  text:           #1a1a1a / #374151 / #6b7280
  CTA button:     bg-[#fbbf24] → bg-[#f59e0b], text-[#1a1a1a], pill rounded
  Status colours: emerald = healthy | amber = warning | red = danger
*/

export type RatioStatus = "healthy" | "warning" | "danger";

export interface Deployment {
  id: string; name: string; chain: string; chainShort: string; chainColor: string;
  stablecoin: string; equityCoin: string; reserveRatio: number; stableSupply: string;
  equitySupply: string; oraclePrice: string; equityYield: number; tvl: string;
  status: RatioStatus; reserveAsset: string;
}

export const DEPLOYMENTS: Deployment[] = [
  { id:"tusd-eth",    name:"TUSD-ETH",    chain:"Ethereum", chainShort:"ETH",  chainColor:"#627eea", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:325, stableSupply:"1.2M",  equitySupply:"45K", oraclePrice:"$3,800", equityYield:6.2, tvl:"$4.56M",  status:"healthy", reserveAsset:"ETH"  },
  { id:"tusd-eth-v2", name:"TUSD-ETH v2", chain:"Ethereum", chainShort:"ETH",  chainColor:"#627eea", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:410, stableSupply:"850K", equitySupply:"22K", oraclePrice:"$3,800", equityYield:5.8, tvl:"$3.24M",  status:"healthy", reserveAsset:"WBTC" },
  { id:"usdp-poly",   name:"USDP-POLY",   chain:"Polygon",  chainShort:"MATIC",chainColor:"#8247e5", stablecoin:"USDP",  equityCoin:"PEQT",  reserveRatio:155, stableSupply:"2.1M",  equitySupply:"18K", oraclePrice:"$0.98",  equityYield:4.1, tvl:"$2.06M",  status:"warning", reserveAsset:"MATIC"},
  { id:"usdb-base",   name:"USDB-BASE",   chain:"Base",     chainShort:"BASE", chainColor:"#0052ff", stablecoin:"USDB",  equityCoin:"BEQT",  reserveRatio:287, stableSupply:"3.4M",  equitySupply:"31K", oraclePrice:"$3,802", equityYield:7.0, tvl:"$9.76M",  status:"healthy", reserveAsset:"ETH"  },
  { id:"usdbn-bsc",   name:"USDBN-BSC",   chain:"BSC",      chainShort:"BNB",  chainColor:"#f0b90b", stablecoin:"USDBN", equityCoin:"BEQT2", reserveRatio:120, stableSupply:"900K", equitySupply:"4K",  oraclePrice:"$0.62",  equityYield:0.0, tvl:"$0.56M",  status:"danger",  reserveAsset:"BNB"  },
];

export const CHART_DATA = {
  reserveRatio: [290,305,315,298,312,320,308,315,325,318,312,322],
  stableSupply: [6.2,6.8,7.1,7.4,7.8,8.0,8.1,8.2,8.3,8.35,8.38,8.4],
};

const CHAINS = [
  { id:"all",      label:"All Chains", short:"ALL"  },
  { id:"Ethereum", label:"Ethereum",   short:"ETH"  },
  { id:"Polygon",  label:"Polygon",    short:"MATIC"},
  { id:"Base",     label:"Base",       short:"BASE" },
  { id:"BSC",      label:"BSC",        short:"BNB"  },
];

/* ─── Status — using site's amber palette for non-error states ─── */
export function statusCfg(s: RatioStatus) {
  if (s === "healthy") return {
    label:        "Healthy",
    dotColor:     "bg-emerald-500",
    tc:           "text-emerald-700",
    badgeBg:      "bg-emerald-50",
    badgeBorder:  "border-emerald-200",
    badgeText:    "text-emerald-700",
    barColor:     "bg-emerald-500",
    cardBorder:   "border-[#e7dac4]",
    headerBg:     "bg-[#fbf6ec]",
  };
  if (s === "warning") return {
    label:        "Warning",
    dotColor:     "bg-amber-500",
    tc:           "text-amber-700",
    badgeBg:      "bg-amber-50",
    badgeBorder:  "border-amber-300",
    badgeText:    "text-amber-700",
    barColor:     "bg-amber-400",
    cardBorder:   "border-amber-300",
    headerBg:     "bg-amber-50",
  };
  return {
    label:        "Force Redemption",
    dotColor:     "bg-red-500",
    tc:           "text-red-600",
    badgeBg:      "bg-red-50",
    badgeBorder:  "border-red-200",
    badgeText:    "text-red-600",
    barColor:     "bg-red-500",
    cardBorder:   "border-red-200",
    headerBg:     "bg-red-50",
  };
}

export function pct(ratio: number) {
  return `${Math.min(100, Math.max(0, ((ratio - 100) / 300) * 100))}%`;
}

/* ─── Sparkline ─── */
export function Sparkline({ data, color = "#f59e0b", h = 48 }: { data: number[]; color?: string; h?: number }) {
  const W = 300, mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${h - ((v - mn) / rng) * (h - 8) - 4}`);
  const fp  = `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(" ")} L ${W},${h} L 0,${h} Z`;
  const gid = `sg-${color.replace(/[^a-z0-9]/gi, "")}-${data[0]}-${data[data.length - 1]}`;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height: h }} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={fp} fill={`url(#${gid})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Reserve Widget — warm card matching site's feature cards ─── */
export function ReserveWidget({ ratio, status, label }: { ratio: number; status: RatioStatus; label?: string }) {
  const c = statusCfg(status);
  return (
    <div className={`rounded-xl border ${c.cardBorder} bg-white p-4 flex flex-col gap-2.5 shadow-sm`}>
      {label && <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>}
      <div className={`text-3xl font-bold leading-none ${c.tc}`}>{ratio}%</div>
      <div className="h-1.5 w-full rounded-full bg-[#efe2c9] overflow-hidden">
        <div className={`h-1.5 rounded-full transition-all duration-700 ${c.barColor}`} style={{ width: pct(ratio) }} />
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${c.dotColor}`} />
        <span className={c.tc}>{c.label}</span>
      </div>
    </div>
  );
}

/* ─── Shared page shell for sub-pages (equity / force / stablepay) ─── */
export function PageShell({ title, subtitle, badge, children }: {
  title: string; subtitle: string; badge?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-[68px] border-b border-[#e7dac4] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link href="/deployments"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition flex items-center gap-1 mb-3">
              ← Back to Deployments
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">{title}</h1>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">{subtitle}</p>
          </div>
          {badge}
        </div>
      </div>
      <main className="min-h-screen bg-[#fbf6ec] pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
      {/* footer — identical to homepage */}
      <footer className="relative overflow-hidden border-t border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-6 pt-14 pb-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-44 w-44 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-2 pt-4 pb-0 md:px-6">
          <div className="grid gap-10 md:grid-cols-[1.25fr_1fr_1fr_1fr] md:gap-12">
            <div className="max-w-sm">
              <div className="logo-hover-wrap mb-4 flex items-center gap-3 text-slate-900">
                <Image src="/Logo.svg" alt="Tectonic logo" width={160} height={44} className="logo-hover-zoom h-9 w-auto object-contain" />
                <span className="text-xl font-black tracking-[0.22em]">TECTONIC</span>
              </div>
              <p className="max-w-xs text-sm leading-6 text-slate-600">Next-generation stablecoin protocol.</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Protocol</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Docs","Contracts","GitHub"].map(l=><li key={l}><a href={l==="GitHub"?"https://github.com/StabilityNexus/Tectonic-EVM-WebUI":"#"} target={l==="GitHub"?"_blank":undefined} rel={l==="GitHub"?"noopener noreferrer":undefined} className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Community</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Discord","Twitter","Forum"].map(l=><li key={l}><a href={l==="Discord"?"https://discord.com/channels/995968619034984528/1503320626096635935":"#"} target={l==="Discord"?"_blank":undefined} rel={l==="Discord"?"noopener noreferrer":undefined} className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Whitepaper","Blog","Press"].map(l=><li key={l}><a href="#" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{l}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="mt-24 border-t border-amber-200/80 pt-6">
            <p className="text-center text-sm text-slate-600">© 2026 Tectonic Protocol. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─── Site card wrapper ─── */
function SiteCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#e7dac4] bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: RatioStatus }) {
  const c = statusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${c.badgeBg} ${c.badgeBorder} ${c.badgeText}`}>
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${c.dotColor}`} />
      {c.label}
    </span>
  );
}

/* ─── Mint / Redeem Modal ─── */
export function MRModal({ mode, d, onClose }: { mode: "mint" | "redeem"; d: Deployment; onClose: () => void }) {
  const [amount, setAmount] = useState("10");
  const [asset,  setAsset]  = useState("ETH");
  const oracle  = parseFloat(d.oraclePrice.replace(/[$,]/g, "")) || 3800;
  const fee     = 0.003;
  const receive = mode === "mint"
    ? `${(parseFloat(amount || "0") * oracle * (1 - fee)).toLocaleString(undefined, { maximumFractionDigits: 0 })} ${d.stablecoin}`
    : `${(parseFloat(amount || "0") / oracle * (1 - fee)).toFixed(6)} ${d.reserveAsset}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#e7dac4] shadow-xl overflow-hidden animate-fade-up">

        {/* header — warm amber tint like homepage sections */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7dac4] bg-[#fbf6ec]">
          <div>
            <h3 className="text-base font-bold text-[#1a1a1a]">
              {mode === "mint" ? "Mint Stablecoins" : "Redeem Stablecoins"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{d.name} · {d.chain}</p>
          </div>
          <button onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-[#efe2c9] hover:bg-[#e7dac4] text-gray-600 transition text-xs font-semibold">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 bg-white">
          {mode === "mint" ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Reserve Asset</label>
                <select value={asset} onChange={e => setAsset(e.target.value)}
                  className="w-full rounded-lg border border-[#e7dac4] bg-[#fbf6ec] px-3 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-amber-400">
                  <option>ETH</option><option>WBTC</option><option>MATIC</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Amount</label>
                <div className="relative">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-[#e7dac4] bg-[#fbf6ec] px-3 py-2.5 pr-14 text-sm text-[#1a1a1a] focus:outline-none focus:border-amber-400" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600">{asset}</span>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{d.stablecoin} Amount</label>
              <div className="relative">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#e7dac4] bg-[#fbf6ec] px-3 py-2.5 pr-16 text-sm text-[#1a1a1a] focus:outline-none focus:border-amber-400" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600">{d.stablecoin}</span>
              </div>
            </div>
          )}

          {/* estimate box */}
          <div className="rounded-lg border border-[#e7dac4] bg-[#fbf6ec] p-3.5 space-y-2">
            {[
              ["Oracle Price", `${d.oraclePrice} / ${d.reserveAsset}`],
              ["Reserve Ratio", `${d.reserveRatio}%`],
              ["Fee", "0.3%"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs text-gray-500">
                <span>{k}</span>
                <span className="font-semibold text-[#1a1a1a]">{v}</span>
              </div>
            ))}
            <div className="border-t border-[#e7dac4] pt-2 flex justify-between text-sm font-bold">
              <span className="text-[#1a1a1a]">You Receive</span>
              <span className="text-amber-600">{receive}</span>
            </div>
          </div>

          <ReserveWidget ratio={d.reserveRatio} status={d.status} label="Current Reserve Ratio" />
        </div>

        <div className="px-6 py-4 bg-[#fbf6ec] border-t border-[#e7dac4]">
          <button className="btn-primary w-full py-2.5 rounded-full font-semibold text-sm text-[#1a1a1a] hover:-translate-y-0.5 transition-transform">
            {mode === "mint" ? `Mint ${d.stablecoin}` : `Redeem ${d.stablecoin}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Contract Card — matches homepage feature cards exactly ─── */
function ContractCard({ d, onMint, onRedeem }: {
  d: Deployment; onMint: (d: Deployment) => void; onRedeem: (d: Deployment) => void;
}) {
  const c = statusCfg(d.status);
  return (
    <div className={`rounded-xl border ${c.cardBorder} bg-[#fbf6ec] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col`}>

      {/* inner white panel — same pattern as homepage feature cards */}
      <div className="m-3 rounded-lg bg-white shadow-sm flex flex-col flex-1 overflow-hidden">

        {/* header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-[#efe2c9] ${c.headerBg}`}>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ background: d.chainColor }}>
              {d.chainShort.slice(0, 3)}
            </div>
            <div>
              <div className="text-sm font-bold text-[#1a1a1a] leading-tight">{d.name}</div>
              <div className="text-xs text-gray-400">{d.chain}</div>
            </div>
          </div>
          <StatusBadge status={d.status} />
        </div>

        {/* stats */}
        <div className="px-4 py-3 flex flex-col flex-1">
          {([
            ["Reserve Ratio", <span className={`font-bold ${c.tc}`} key="r">{d.reserveRatio}%</span>],
            ["Stable Supply",  d.stableSupply],
            ["Equity Supply",  d.equitySupply],
            ["Oracle Price",   d.oraclePrice],
            ["Equity Yield",   <span className="font-bold text-amber-600" key="y">{d.equityYield}%</span>],
          ] as [string, React.ReactNode][]).map(([lbl, val]) => (
            <div key={lbl} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 text-sm">
              <span className="text-gray-400">{lbl}</span>
              <span className="text-[#1a1a1a] font-medium">{val}</span>
            </div>
          ))}
        </div>

        {/* ratio bar */}
        <div className="px-4 pb-3">
          <div className="h-1.5 w-full rounded-full bg-[#efe2c9] overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all duration-700 ${c.barColor}`} style={{ width: pct(d.reserveRatio) }} />
          </div>
        </div>

        {/* action buttons */}
        <div className="px-4 py-3 flex gap-2 border-t border-[#efe2c9]">
          <button onClick={() => onMint(d)}
            className="flex-1 py-1.5 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1a1a1a] text-xs font-semibold transition">
            Mint
          </button>
          <button onClick={() => onRedeem(d)}
            className="flex-1 py-1.5 rounded-full border border-[#e7dac4] bg-white hover:bg-[#fbf6ec] text-[#1a1a1a] text-xs font-semibold transition">
            Redeem
          </button>
          {d.status === "danger"
            ? <Link href="/force-redemption"
                className="flex-1 py-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition text-center">
                Force Redeem
              </Link>
            : <button className="flex-1 py-1.5 rounded-full border border-[#e7dac4] bg-white hover:bg-[#fbf6ec] text-gray-600 text-xs font-semibold transition">
                Details
              </button>
          }
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function DeploymentsPage() {
  const [activeChain,  setActiveChain]  = useState("all");
  const [search,       setSearch]       = useState("");
  const [mintTarget,   setMintTarget]   = useState<Deployment | null>(null);
  const [redeemTarget, setRedeemTarget] = useState<Deployment | null>(null);
  const [tvl,          setTvl]          = useState(0);
  const countDone = useRef(false);

  useEffect(() => {
    if (countDone.current) return;
    countDone.current = true;
    const target = 12.4, dur = 1800, s0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - s0) / dur, 1);
      setTvl(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const filtered = DEPLOYMENTS.filter(d => {
    const mc = activeChain === "all" || d.chain === activeChain;
    const ms = !search || [d.name, d.chain, d.stablecoin].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mc && ms;
  });

  const dangerList  = DEPLOYMENTS.filter(d => d.status === "danger");
  const warningList = DEPLOYMENTS.filter(d => d.status === "warning");

  return (
    <>
      {mintTarget   && <MRModal mode="mint"   d={mintTarget}   onClose={() => setMintTarget(null)}   />}
      {redeemTarget && <MRModal mode="redeem" d={redeemTarget} onClose={() => setRedeemTarget(null)} />}

      <Navbar />

      {/* ── page header — white with amber accent label ───────────────── */}
      <div className="pt-[68px] border-b border-[#e7dac4] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Protocol Overview</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">Tectonic Deployments</h1>
            <p className="text-gray-500 text-sm mt-1">Live reserve ratios, contract health, and protocol actions</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            {dangerList.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {dangerList.length} Force Redemption Active
              </span>
            )}
            {warningList.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded-full px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {warningList.length} Warning
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── main content — warm off-white background ─────────────────── */}
      <main className="min-h-screen bg-[#fbf6ec] pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* stat row — white cards with amber accent values */}
          <div className="py-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:"Total TVL",     value:`$${tvl.toFixed(1)}M`, accent:"text-amber-600"  },
              { label:"Stablecoins",   value:"8.4M",                accent:"text-[#1a1a1a]"  },
              { label:"Equity Coins",  value:"120K",                accent:"text-[#1a1a1a]"  },
              { label:"Reserve Ratio", value:"312%",                accent:"text-emerald-600" },
            ].map(m => (
              <SiteCard key={m.label} className="px-4 py-3.5">
                <div className="text-xs text-gray-400 font-medium mb-1">{m.label}</div>
                <div className={`text-xl font-bold ${m.accent}`}>{m.value}</div>
              </SiteCard>
            ))}
          </div>

          {/* ── SECTION 1: Deployments ─────────────────────────────────── */}
          <section className="py-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Deployments</h2>
              <p className="text-gray-500 text-xs mt-0.5">All active protocol contracts across EVM chains</p>
            </div>

            {/* filters */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                  className="w-40 rounded-full border border-[#e7dac4] bg-white py-1.5 pl-8 pr-3 text-sm text-[#1a1a1a] focus:border-amber-400 focus:outline-none shadow-sm" />
              </div>
              {CHAINS.map(c => (
                <button key={c.id} onClick={() => setActiveChain(c.id)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    activeChain === c.id
                      ? "border-[#fbbf24] bg-[#fbbf24] text-[#1a1a1a] shadow-sm"
                      : "border-[#e7dac4] bg-white text-gray-600 hover:border-amber-300 hover:text-amber-700"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex gap-4 items-start">
              {/* sidebar — matching homepage card style */}
              <SiteCard className="hidden lg:flex flex-col w-40 flex-shrink-0 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[#efe2c9] bg-[#fbf6ec]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Networks</p>
                </div>
                {CHAINS.map(c => (
                  <button key={c.id} onClick={() => setActiveChain(c.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition border-l-2 ${
                      activeChain === c.id
                        ? "border-amber-500 bg-amber-50 text-amber-700 font-semibold"
                        : "border-transparent text-gray-500 hover:bg-[#fbf6ec] hover:text-[#1a1a1a]"
                    }`}>
                    <span>{c.label}</span>
                  </button>
                ))}
              </SiteCard>

              {/* cards grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.length === 0
                  ? <div className="col-span-full text-center py-16 text-gray-400 text-sm">No deployments found</div>
                  : filtered.map(d => <ContractCard key={d.id} d={d} onMint={setMintTarget} onRedeem={setRedeemTarget} />)
                }
              </div>
            </div>
          </section>

          {/* divider */}
          <div className="border-t border-[#e7dac4]" />

          {/* ── SECTION 2: Protocol Overview ───────────────────────────── */}
          <section className="py-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Protocol Overview</h2>
              <p className="text-gray-500 text-xs mt-0.5">Reserve health and supply metrics</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] mb-4">
              {/* reserve health card */}
              <SiteCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">System Health</p>
                    <h3 className="mt-1 text-base font-bold text-[#1a1a1a]">Healthy overall — one chain under watch</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 flex-shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <ReserveWidget ratio={350} status="healthy" label="Ethereum" />
                  <ReserveWidget ratio={155} status="warning" label="Polygon"  />
                  <ReserveWidget ratio={120} status="danger"  label="BSC"      />
                </div>
              </SiteCard>

              {/* key info card */}
              <SiteCard className="p-5 flex flex-col gap-3">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Key Info</p>
                <div className="rounded-lg bg-[#fbf6ec] border border-[#e7dac4] p-3.5">
                  <div className="text-xs text-gray-500 font-medium">Minimum safe ratio</div>
                  <div className="text-2xl font-bold text-amber-600 mt-0.5">150%</div>
                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    Below this level equity minting pauses and redemptions activate.
                  </p>
                </div>
                <div className="rounded-lg bg-[#fbf6ec] border border-[#e7dac4] p-3.5">
                  <div className="text-xs text-gray-500 font-medium mb-1">Force redemption watch</div>
                  <p className="text-sm text-[#1a1a1a] font-medium">
                    {dangerList.length > 0
                      ? `${dangerList.length} deployment is below the 150% threshold.`
                      : "No deployments are currently below the threshold."
                    }
                  </p>
                </div>
              </SiteCard>
            </div>

            {/* charts */}
            <div className="grid gap-4 md:grid-cols-2">
              {([
                { title:"Reserve Ratio Trend", value:"312%", trend:"Stable",  data:CHART_DATA.reserveRatio, color:"#f59e0b" },
                { title:"Stablecoin Supply",   value:"8.4M", trend:"Growing", data:CHART_DATA.stableSupply, color:"#f59e0b" },
              ] as { title:string; value:string; trend:string; data:number[]; color:string }[]).map(card => (
                <SiteCard key={card.title} className="p-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xs text-gray-400 font-medium">{card.title}</div>
                      <div className="text-xl font-bold text-[#1a1a1a] mt-0.5">{card.value}</div>
                    </div>
                    <span className="text-xs font-medium text-amber-600">{card.trend}</span>
                  </div>
                  <Sparkline data={card.data} color={card.color} />
                </SiteCard>
              ))}
            </div>
          </section>

          {/* divider */}
          <div className="border-t border-[#e7dac4]" />

          {/* ── SECTION 3: Explore features — styled like homepage cards ─ */}
          <section className="py-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Explore Protocol Features</h2>
              <p className="text-gray-500 text-xs mt-0.5">Deep-dive into each feature</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  href: "/equity",
                  title: "Equity Coins",
                  desc: "Protocol ownership tokens that earn yield from fees and carry leveraged reserve exposure.",
                  meta: "18.4% APR",
                  metaColor: "text-amber-600",
                },
                {
                  href: "/force-redemption",
                  title: "Force Redemption",
                  desc: "When reserve drops below 150%, equity minting halts and stablecoin holders redeem 1:1.",
                  meta: dangerList.length > 0 ? `${dangerList.length} deployment active` : "All deployments healthy",
                  metaColor: dangerList.length > 0 ? "text-red-600" : "text-emerald-600",
                  alert: dangerList.length > 0,
                },
                {
                  href: "/stablepay",
                  title: "StablePay",
                  desc: "Pay with native assets and settle in stablecoins. Try the live animated payment flow.",
                  meta: "Live demo available",
                  metaColor: "text-amber-600",
                },
              ].map(fc => (
                /* matches homepage feature card pattern exactly */
                <Link key={fc.href} href={fc.href}
                  className="group rounded-xl border border-[#e7dac4] bg-[#fbf6ec] p-1 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <div className="relative bg-white rounded-lg pt-14 px-5 pb-5 shadow-sm flex flex-col h-full min-h-[180px]">
                    {/* top-left icon circle */}
                    <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white border border-[#efe2c9] flex items-center justify-center shadow-sm">
                      {fc.alert
                        ? <span className="h-3 w-3 rounded-full bg-red-500 block" />
                        : <span className="h-3 w-3 rounded-full bg-amber-400 block" />
                      }
                    </div>
                    <h3 className="text-sm font-bold text-[#1a1a1a] mb-1.5">{fc.title}</h3>
                    <p className="text-xs text-gray-500 leading-5 flex-1">{fc.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-xs font-semibold ${fc.metaColor}`}>{fc.meta}</span>
                      <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                        Open →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* footer — identical to homepage */}
      <footer className="relative overflow-hidden border-t border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-6 pt-14 pb-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-44 w-44 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-2 pt-4 pb-0 md:px-6">
          <div className="grid gap-10 md:grid-cols-[1.25fr_1fr_1fr_1fr] md:gap-12">
            {/* brand */}
            <div className="max-w-sm">
              <div className="logo-hover-wrap mb-4 flex items-center gap-3 text-slate-900">
                <Image src="/Logo.svg" alt="Tectonic logo" width={160} height={44} className="logo-hover-zoom h-9 w-auto object-contain" />
                <span className="text-xl font-black tracking-[0.22em]">TECTONIC</span>
              </div>
              <p className="max-w-xs text-sm leading-6 text-slate-600">Next-generation stablecoin protocol.</p>
            </div>

            {/* Protocol */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Protocol</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Docs","Contracts","GitHub"].map(l=>(
                  <li key={l}><a href={l==="GitHub"?"https://github.com/StabilityNexus/Tectonic-EVM-WebUI":"#"} target={l==="GitHub"?"_blank":undefined} rel={l==="GitHub"?"noopener noreferrer":undefined} className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Community</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Discord","Twitter","Forum"].map(l=>(
                  <li key={l}><a href={l==="Discord"?"https://discord.com/channels/995968619034984528/1503320626096635935":"#"} target={l==="Discord"?"_blank":undefined} rel={l==="Discord"?"noopener noreferrer":undefined} className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Whitepaper","Blog","Press"].map(l=>(
                  <li key={l}><a href="#" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-24 border-t border-amber-200/80 pt-6">
            <p className="text-center text-sm text-slate-600">© 2026 Tectonic Protocol. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
