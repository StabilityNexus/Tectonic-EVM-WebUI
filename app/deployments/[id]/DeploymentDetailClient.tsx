"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { statusCfg, pct } from "@/lib/deployments-ui";
import { DEPLOYMENTS } from "@/lib/deployments-data";
import type { Deployment } from "@/lib/deployments-data";
import { useTranslations } from "@/lib/i18n";

/* ─── Shared mint/redeem form ─── */
function MintRedeemForm({
  mode,
  inputAsset,
  outputToken,
  estimateFn,
}: {
  mode: "mint" | "redeem";
  inputAsset: string;
  outputToken: string;
  estimateFn: (net: number) => string;
}) {
  const [amount, setAmount] = useState("10");
  const net = parseFloat(amount || "0") * (1 - 0.003);
  const estimate = estimateFn(net);
  const isMint = mode === "mint";
  const t = useTranslations("common");
 
  return (
    <div className="space-y-4 pt-2">
      {/* input row */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">
          {isMint ? t("deposit") : t("burn")} {inputAsset}
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-xl border border-[#e7dac4] bg-[#fafaf8] px-4 py-3 pr-20 text-sm text-[#1a1a1a] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
            placeholder="0.00"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500">
            {inputAsset}
          </span>
        </div>
      </div>
 
      {/* summary box */}
      <div className="rounded-xl border border-[#e7dac4] bg-[#fafaf8] px-4 py-3 space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{t("fee")}</span>
          <span className="text-[#1a1a1a] font-medium">0.3%</span>
        </div>
        <div className="border-t border-[#efe2c9] pt-2 flex justify-between text-sm font-bold">
          <span className="text-[#1a1a1a]">{t("youReceive")}</span>
          <span className="text-amber-500">
            {estimate} {outputToken}
          </span>
        </div>
      </div>
 
      {/* action button */}
      <button
        className={`w-full py-3 rounded-full text-sm font-bold tracking-wide transition hover:-translate-y-0.5 shadow-sm ${
          isMint
            ? "bg-amber-400 hover:bg-amber-500 text-[#1a1a1a] shadow-amber-100"
            : "border-2 border-amber-300 bg-white hover:bg-amber-50 text-[#1a1a1a]"
        }`}
      >
        {isMint ? `${t("mint")} ${outputToken}` : `${t("redeem")} ${inputAsset}`}
      </button>
    </div>
  );
}

/* ─── StableCoin card ─── */
function StableCoinCard({ d }: { d: Deployment }) {
  const [tab, setTab] = useState<"mint" | "redeem">("mint");
  const c = statusCfg(d.status);
  const crashTolerance = Math.round(((d.reserveRatio - 100) / d.reserveRatio) * 100);
  const tCommon = useTranslations("common");
  const tDetail = useTranslations("deploymentDetail");

  return (
    <div className="rounded-2xl border border-[#e7dac4] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)] overflow-hidden flex flex-col">
      {/* header */}
      <div className="px-6 pt-6 pb-4 text-center border-b border-[#f0ece4]">
        <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase mb-1">{tDetail("stablecoin")}</p>
        <p className="text-3xl font-black text-[#1a1a1a]">{d.stablecoin}</p>
      </div>

      {/* stats row */}
      <div className="grid grid-cols-3 divide-x divide-[#f0ece4] border-b border-[#f0ece4]">
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">{tDetail("supply")}</p>
          <p className="text-sm font-bold text-[#1a1a1a]">{d.stableSupply}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">{tDetail("crashTolerance")}</p>
          <p className="text-sm font-bold text-emerald-500">{crashTolerance}%</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">{tDetail("reserveRatio")}</p>
          <p className={`text-sm font-bold ${c.tc}`}>{d.reserveRatio}%</p>
        </div>
      </div>

      {/* mint / redeem toggle */}
      <div className="px-6 pt-5 flex-1 flex flex-col">
        <div className="flex rounded-xl border border-[#e7dac4] overflow-hidden mb-1">
          <button
            onClick={() => setTab("mint")}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${
              tab === "mint"
                ? "bg-amber-400 text-[#1a1a1a]"
                : "bg-white text-gray-400 hover:bg-[#faf7f0]"
            }`}
          >
            {tCommon("mint")}
          </button>
          <button
            onClick={() => setTab("redeem")}
            className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-[#e7dac4] ${
              tab === "redeem"
                ? "bg-amber-400 text-[#1a1a1a]"
                : "bg-white text-gray-400 hover:bg-[#faf7f0]"
            }`}
          >
            {tCommon("redeem")}
          </button>
        </div>

        <div className="pb-6">
          {tab === "mint" ? (
            <MintRedeemForm
              mode="mint"
              inputAsset={d.reserveAsset}
              outputToken={d.stablecoin}
              estimateFn={net => `~${(net * 3800).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            />
          ) : (
            <MintRedeemForm
              mode="redeem"
              inputAsset={d.stablecoin}
              outputToken={d.reserveAsset}
              estimateFn={net => `~${(net / 3800).toFixed(6)}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── EquityCoin card ─── */
function EquityCoinCard({ d }: { d: Deployment }) {
  const [tab, setTab] = useState<"mint" | "redeem">("mint");
  const tCommon = useTranslations("common");
  const tDetail = useTranslations("deploymentDetail");

  return (
    <div className="rounded-2xl border border-[#e7dac4] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)] overflow-hidden flex flex-col">
      {/* header */}
      <div className="px-6 pt-6 pb-4 text-center border-b border-[#f0ece4]">
        <p className="text-[10px] font-black tracking-[0.2em] text-violet-500 uppercase mb-1">{tDetail("equityCoin")}</p>
        <p className="text-3xl font-black text-[#1a1a1a]">{d.equityCoin}</p>
      </div>

      {/* stats row */}
      <div className="grid grid-cols-3 divide-x divide-[#f0ece4] border-b border-[#f0ece4]">
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">{tDetail("supply")}</p>
          <p className="text-sm font-bold text-[#1a1a1a]">{d.equitySupply}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">{tDetail("annualYield")}</p>
          <p className="text-sm font-bold text-amber-500">{d.equityYield}%</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">{tDetail("leverage")}</p>
          <p className="text-sm font-bold text-violet-500">{d.equityLeverage}</p>
        </div>
      </div>

      {/* mint / redeem toggle */}
      <div className="px-6 pt-5 flex-1 flex flex-col">
        <div className="flex rounded-xl border border-[#e7dac4] overflow-hidden mb-1">
          <button
            onClick={() => setTab("mint")}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${
              tab === "mint"
                ? "bg-amber-400 text-[#1a1a1a]"
                : "bg-white text-gray-400 hover:bg-[#faf7f0]"
            }`}
          >
            {tCommon("mint")}
          </button>
          <button
            onClick={() => setTab("redeem")}
            className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-[#e7dac4] ${
              tab === "redeem"
                ? "bg-amber-400 text-[#1a1a1a]"
                : "bg-white text-gray-400 hover:bg-[#faf7f0]"
            }`}
          >
            {tCommon("redeem")}
          </button>
        </div>

        <div className="pb-6">
          {tab === "mint" ? (
            <MintRedeemForm
              mode="mint"
              inputAsset={d.reserveAsset}
              outputToken={d.equityCoin}
              estimateFn={net => `~${(net / 24.5).toFixed(4)}`}
            />
          ) : (
            <MintRedeemForm
              mode="redeem"
              inputAsset={d.equityCoin}
              outputToken={d.reserveAsset}
              estimateFn={net => `~${(net * 24.5 / 3800).toFixed(6)}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function DeploymentDetailClient({ id }: { id: string }) {
  const tDetail = useTranslations("deploymentDetail");
  const tFooter = useTranslations("footer");

  const d = DEPLOYMENTS.find(x => x.id === id);
  if (!d) return notFound();

  const c = statusCfg(d.status);

  return (
    <>
      <Navbar />

      {/* ── page header ── */}
      <div className="pt-[68px] border-b border-[#e7dac4] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7">
          <Link
            href="/deployments"
            className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition flex items-center gap-1 mb-4"
          >
            {tDetail("back")}
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                style={{ background: d.chainColor }}
              >
                {d.chainShort.slice(0, 3)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#1a1a1a] leading-tight">
                  {d.name}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {tDetail("backedBy", { reserve: d.reserveAsset, peg: d.pegAsset, chain: d.chain })}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${c.badgeBg} ${c.badgeBorder} ${c.badgeText}`}
            >
              <span className={`h-2 w-2 rounded-full ${c.dotColor}`} />
              {c.label}
            </span>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-[#f7f4ef] pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── TOP: two action cards ── */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <StableCoinCard d={d} />
            <EquityCoinCard d={d} />
          </div>

          {/* ── BOTTOM: Deployment Health ── */}
          <div className="rounded-2xl border border-[#e7dac4] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f0ece4]">
              <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase">
                {tDetail("health")}
              </p>
            </div>
            <div className="px-6 py-6 grid sm:grid-cols-3 gap-8">

              {/* Total Reserve */}
              <div>
                <p className="text-xs text-gray-400 mb-2">{tDetail("totalReserve")}</p>
                <p className="text-3xl font-black text-[#1a1a1a]">{d.totalReserve}</p>
                <p className="text-xs text-gray-400 mt-1">{tDetail("inReserve", { reserve: d.reserveAsset })}</p>
              </div>

              {/* Reserve Ratio slider */}
              <div>
                <p className="text-xs text-gray-400 mb-2">{tDetail("reserveRatio")}</p>
                <p className={`text-2xl font-black mb-3 ${c.tc}`}>
                  {d.reserveRatio}% <span className="text-base font-semibold text-gray-400">{tDetail("minSafe")}</span>
                </p>
                <div className="h-2.5 w-full rounded-full bg-[#efe2c9] overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${c.barColor}`}
                    style={{ width: pct(d.reserveRatio) }}
                  />
                </div>
                <div className="flex justify-between text-[10px] mt-1.5">
                  <span className="text-gray-300">100%</span>
                  <span className="text-amber-400 font-bold">{tDetail("safeSafe")}</span>
                  <span className="text-gray-300">400%</span>
                </div>
              </div>

              {/* Trigger Redemptions */}
              <div>
                <p className="text-xs text-gray-400 mb-2">{tDetail("triggerRedemptions")}</p>
                {d.status === "danger" ? (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-3">
                    <p className="text-sm font-bold text-red-600">{tDetail("active")}</p>
                    <p className="text-xs text-red-500 leading-5">
                      {tDetail("activeDesc")}
                    </p>
                    <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping flex-shrink-0" />
                      Trigger Redemption →
                    </button>
                  </div>
                ) : d.status === "warning" ? (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                    <p className="text-sm font-bold text-amber-600 mb-1">{tDetail("warning")}</p>
                    <p className="text-xs text-amber-500 leading-5">
                      {tDetail("warningDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                    <p className="text-sm font-bold text-emerald-600 mb-1">{tDetail("notActive")}</p>
                    <p className="text-xs text-emerald-600 leading-5">
                      {tDetail("notActiveDesc")}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── footer ── */}
      <footer className="relative overflow-hidden border-t border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-6 pt-14 pb-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-44 w-44 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-2 pt-4 pb-0 md:px-6">
          <div className="grid gap-10 md:grid-cols-[1.25fr_1fr_1fr_1fr] md:gap-12">
            <div className="max-w-sm">
              <div className="logo-hover-wrap mb-4 flex items-center gap-3 text-slate-900">
                <Image src="/Logo.svg" alt="Tectonic logo" width={140} height={40} className="logo-hover-zoom h-8 w-auto object-contain" />
                <span className="text-lg font-black tracking-[0.22em]">TECTONIC</span>
              </div>
              <p className="max-w-xs text-sm leading-6 text-slate-600">{tFooter("desc")}</p>
            </div>
            {[
              { title: tFooter("protocol"),  links: [["Docs","#"],["Contracts","#"],["GitHub","https://github.com/StabilityNexus/Tectonic-EVM-WebUI"]] },
              { title: tFooter("community"), links: [["Discord","https://discord.com/channels/995968619034984528/1503320626096635935"],["Twitter","#"]] },
              { title: tFooter("resources"), links: [[tFooter("technicalPaper"),"#"]] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">{col.title}</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="transition hover:text-amber-700 hover:underline hover:underline-offset-4"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 border-t border-amber-200/80 pt-6">
            <p className="text-center text-sm text-slate-600">{tFooter("rights")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
