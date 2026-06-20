"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

import type { RatioStatus, Deployment } from "@/lib/deployments-data";
import { DEPLOYMENTS } from "@/lib/deployments-data";
import { statusCfg, pct } from "@/lib/deployments-ui";
import { useTranslations } from "@/lib/i18n";


const CHAINS = [
  { id:"all",      label:"All Networks", short:"ALL"  },
  { id:"Ethereum", label:"Ethereum",     short:"ETH"  },
  { id:"Polygon",  label:"Polygon",      short:"MATIC"},
  { id:"Base",     label:"Base",         short:"BASE" },
  { id:"BSC",      label:"BSC",          short:"BNB"  },
];

const PEG_ASSETS = [
  { id:"all", label:"All" },
  { id:"USD", label:"USD" },
  { id:"EUR", label:"EUR" },
  { id:"AUD", label:"AUD" },
  { id:"INR", label:"INR" },
  { id:"BRL", label:"BRL" },
  { id:"RUB", label:"RUB" },
  { id:"CNY", label:"CNY" },
  { id:"ZAR", label:"ZAR" },
];

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

/* ─── Contract Card — clean summary card, single Open button ─── */
function ContractCard({ d }: { d: Deployment }) {
  const c = statusCfg(d.status);
  const tDeploy = useTranslations("deployments");
  return (
    <div className={`rounded-xl border ${c.cardBorder} bg-[#fbf6ec] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col`}>
      <div className="m-3 rounded-lg bg-white shadow-sm flex flex-col flex-1 overflow-hidden">

        {/* header */}
        <div className={`px-4 pt-4 pb-3 border-b border-[#efe2c9] ${c.headerBg}`}>
          {/* chain badge + status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                style={{ background: d.chainColor }}>
                {d.chainShort.slice(0, 3)}
              </div>
              <span className="text-xs text-gray-400">{d.chain}</span>
            </div>
            <StatusBadge status={d.status} />
          </div>
          {/* title line */}
          <h3 className="text-base font-bold text-[#1a1a1a] leading-tight">{d.name}</h3>
          {/* subtitle: Backed by X · Pegged to Y */}
          <p className="text-xs text-gray-400 mt-0.5">
            Backed by {d.reserveAsset} · Pegged to {d.pegAsset}
          </p>
        </div>

        {/* stats — mentor's exact order */}
        <div className="px-4 py-3 flex flex-col flex-1">
          {([
            ["Reserve Ratio",   <span className={`font-bold ${c.tc}`} key="rr">{d.reserveRatio}%</span>],
            ["Total Reserve",   d.totalReserve],
            ["StableCoin Supply", d.stableSupply],
            ["EquityCoin Supply", d.equitySupply],
            ["EquityCoin Leverage", <span className="font-bold text-[#1a1a1a]" key="lev">{d.equityLeverage}</span>],
            ["EquityCoin Yield", <span className="font-bold text-amber-600" key="y">{d.equityYield}%</span>],
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
        <div className="px-4 py-3 border-t border-[#efe2c9] flex flex-col gap-2">
          <Link href={`/deployments/${d.id}`}
            className="block w-full py-2.5 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1a1a1a] text-xs font-semibold transition text-center">
            Open →
          </Link>
          {d.status === "warning" && (
            <p className="text-[10px] text-amber-600 text-center font-medium">
              {tDeploy("warningStatus")}
            </p>
          )}
          {d.status === "danger" && (
            <p className="text-[10px] text-red-500 text-center font-medium">
              {tDeploy("dangerStatus")}
            </p>
          )}
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
  const [activePeg,    setActivePeg]    = useState("all");
  const [search,       setSearch]       = useState("");
  const [tvl,          setTvl]          = useState(0);
  const countDone = useRef(false);

  useEffect(() => {
    if (countDone.current) return;
    countDone.current = true;
    const target = 12.4, dur = 1800, s0 = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const p = Math.min((now - s0) / dur, 1);
      setTvl(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const filtered = DEPLOYMENTS.filter(d => {
    const mc = activeChain === "all" || d.chain === activeChain;
    const mp = activePeg   === "all" || d.pegAsset === activePeg;
    const ms = !search || [d.name, d.chain, d.stablecoin].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mc && mp && ms;
  });

  const dangerList  = DEPLOYMENTS.filter(d => d.status === "danger");
  const warningList = DEPLOYMENTS.filter(d => d.status === "warning");

  return (
    <>
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
                {dangerList.length} Trigger Redemptions Active
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
              { label:"EquityCoins",   value:"120K",                accent:"text-[#1a1a1a]"  },
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
              <p className="text-gray-500 text-xs mt-0.5">All active protocol contracts across EVM networks</p>
            </div>

            {/* ── Filters ──────────────────────────────────────────────── */}
            <div className="mb-5 flex flex-wrap gap-3 items-center">
              {/* search */}
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                  className="w-44 rounded-lg border border-[#e7dac4] bg-white py-2 pl-8 pr-3 text-sm text-[#1a1a1a] focus:border-amber-400 focus:outline-none shadow-sm" />
              </div>

              {/* network dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-400 whitespace-nowrap">Network</label>
                <select value={activeChain} onChange={e => setActiveChain(e.target.value)}
                  className="rounded-lg border border-[#e7dac4] bg-white py-2 pl-3 pr-8 text-sm text-[#1a1a1a] font-medium focus:border-amber-400 focus:outline-none shadow-sm cursor-pointer appearance-none"
                  style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b8a99a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center" }}>
                  {CHAINS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              {/* peg asset dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-400 whitespace-nowrap">Peg Asset</label>
                <select value={activePeg} onChange={e => setActivePeg(e.target.value)}
                  className="rounded-lg border border-[#e7dac4] bg-white py-2 pl-3 pr-8 text-sm text-[#1a1a1a] font-medium focus:border-amber-400 focus:outline-none shadow-sm cursor-pointer appearance-none"
                  style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b8a99a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center" }}>
                  {PEG_ASSETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>

              {/* active filter chips */}
              {(activeChain !== "all" || activePeg !== "all") && (
                <button onClick={() => { setActiveChain("all"); setActivePeg("all"); }}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-800 transition flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M18 6L6 18M6 6l12 12"/></svg>
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.length === 0
                ? <div className="col-span-full text-center py-16 text-gray-400 text-sm">No deployments found</div>
                : filtered.map(d => <ContractCard key={d.id} d={d} />)
              }
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
                {["Discord","Twitter"].map(l=>(
                  <li key={l}><a href={l==="Discord"?"https://discord.com/channels/995968619034984528/1503320626096635935":"#"} target={l==="Discord"?"_blank":undefined} rel={l==="Discord"?"noopener noreferrer":undefined} className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Technical Paper"].map(l=>(
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
