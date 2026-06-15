"use client";

import Link from "next/link";
import { PageShell, ReserveWidget, statusCfg } from "@/app/deployments/page";
import { DEPLOYMENTS } from "@/lib/deployments-data";

export default function ForceRedemptionPage() {
  const dangerList  = DEPLOYMENTS.filter(d => d.status === "danger");
  const warningList = DEPLOYMENTS.filter(d => d.status === "warning");

  return (
    <PageShell
      title="Trigger Redemptions Monitor"
      subtitle="Tectonic's unique stability mechanism — when a deployment drops below 150% reserve ratio, equity minting halts and stablecoin holders can redeem 1:1 until health is restored."
      badge={
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 self-start">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Monitoring Active
        </span>
      }
    >
      {/* alert banners */}
      {dangerList.length > 0 && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-5 flex items-start gap-4 mb-4">
          <div className="text-2xl flex-shrink-0">⚠️</div>
          <div>
            <h4 className="font-bold text-red-700 text-sm">Trigger Redemptions Active — {dangerList.map(d => d.name).join(", ")}</h4>
            <p className="text-red-600 text-xs mt-1">Reserve ratio has dropped below 150%. StableCoin holders can redeem at 1:1 until the ratio recovers.</p>
          </div>
        </div>
      )}
      {warningList.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-4 mb-4">
          <div className="text-xl flex-shrink-0">⚡</div>
          <div>
            <h4 className="font-bold text-amber-700 text-sm">Warning — {warningList.map(d => d.name).join(", ")}</h4>
            <p className="text-amber-600 text-xs mt-1">Approaching the minimum safe threshold of 150%. Monitor closely.</p>
          </div>
        </div>
      )}

      {/* how it works */}
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm mb-6">
        <h3 className="font-black text-slate-900 text-lg mb-4">How Trigger Redemptions Works</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step:"01", title:"Ratio drops below 150%",     desc:"Oracle detects the reserve is undercollateralised relative to stablecoin supply." },
            { step:"02", title:"Equity minting halted",       desc:"No new equity coins can be issued while the ratio is below the safe threshold." },
            { step:"03", title:"StableCoins redeemable 1:1",  desc:"Holders can burn stablecoins at face value, withdrawing reserve assets directly." },
            { step:"04", title:"Ratio restored",              desc:"As stablecoins are burned the ratio recovers and normal operations resume." },
          ].map(item => (
            <div key={item.step} className="rounded-2xl bg-amber-50 p-4">
              <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">{item.step}</div>
              <div className="font-bold text-sm text-slate-900 mb-1">{item.title}</div>
              <p className="text-xs text-slate-600 leading-5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* reserve widgets */}
      <h3 className="font-black text-slate-900 text-lg mb-4">Current Reserve Health</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <ReserveWidget ratio={120} status="danger"  label="BSC — USDBN-BSC (Active)" />
        <div className="rounded-2xl bg-white border border-amber-100 p-5 shadow-sm flex flex-col gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Minimum Safe Ratio</div>
          <div className="text-4xl font-black text-amber-500">150%</div>
          <p className="text-xs text-slate-500">Below this level equity minting pauses and trigger redemptions begin.</p>
          <div className="text-xs text-slate-500 mt-auto">
            Gap to safe ratio: <span className="text-red-600 font-bold">−30%</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-amber-100 p-5 shadow-sm flex flex-col gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Redemption Progress</div>
          <div className="text-4xl font-black text-amber-600">34%</div>
          <div className="text-xs text-slate-500">of eligible USDBN redeemed</div>
          <div className="h-2 w-full rounded-full bg-[#efe2c9] mt-auto overflow-hidden">
            <div className="h-2 bg-amber-400 rounded-full" style={{ width: "34%" }} />
          </div>
        </div>
      </div>

      {/* full status table */}
      <div className="rounded-2xl bg-white border border-[#e7dac4] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#efe2c9] bg-[#fbf6ec]">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">All Deployment Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efe2c9]">
                {["Contract", "Chain", "Reserve Ratio", "Safe Threshold", "Status", "Action"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#faf6ef]">
              {DEPLOYMENTS.map(d => {
                const c = statusCfg(d.status);
                return (
                  <tr key={d.id} className="hover:bg-amber-50/30 transition">
                    <td className="px-5 py-4 font-semibold text-[#1a1a1a] whitespace-nowrap">{d.name}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ background: d.chainColor }} />
                        <span className="text-xs text-gray-500">{d.chain}</span>
                      </div>
                    </td>
                    <td className={`px-5 py-4 font-black whitespace-nowrap ${c.tc}`}>{d.reserveRatio}%</td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">150%</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${c.badgeBg} ${c.badgeBorder} ${c.badgeText}`}>
                        <span className={`h-1.5 w-1.5 rounded-full inline-block mr-1 ${c.dotColor}`} />
                        {c.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {d.status === "danger" ? (
                        /* Link to detail page — Redeem StableCoin tab is default-selectable there */
                        <Link href={`/deployments/${d.id}`}
                          className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-200 transition whitespace-nowrap">
                          Trigger Redeem →
                        </Link>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-[#fbf6ec] text-gray-500 text-xs font-bold border border-[#e7dac4] whitespace-nowrap">
                          Monitor
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* reserve ratio scale */}
      <div className="mt-6 rounded-2xl bg-white border border-[#e7dac4] shadow-sm p-6">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-5">Reserve Ratio Scale</h3>
        <div className="space-y-4">
          {[
            { ratio: 350, status: "healthy" as const, label: "Ethereum — TUSD-ETH",  desc: "Well above the safety threshold" },
            { ratio: 287, status: "healthy" as const, label: "Base — USDB-BASE",     desc: "Healthy margin above threshold" },
            { ratio: 155, status: "warning" as const, label: "Polygon — USDP-POLY",  desc: "Approaching the 150% threshold" },
            { ratio: 120, status: "danger"  as const, label: "BSC — USDBN-BSC",      desc: "Below threshold — active" },
          ].map(item => {
            const c = statusCfg(item.status);
            const w = Math.min(100, Math.max(0, ((item.ratio - 100) / 300) * 100));
            return (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-40 flex-shrink-0">
                  <div className="text-xs font-semibold text-[#1a1a1a] leading-tight">{item.label}</div>
                  <div className={`text-xs mt-0.5 ${c.tc}`}>{item.ratio}%</div>
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-[#efe2c9] overflow-hidden">
                  <div className={`h-2.5 rounded-full ${c.barColor} transition-all duration-700`} style={{ width: `${w}%` }} />
                </div>
                <div className="w-36 text-xs text-gray-400 text-right hidden sm:block">{item.desc}</div>
              </div>
            );
          })}
          {/* 150% threshold marker */}
          <div className="flex items-center gap-4">
            <div className="w-40 flex-shrink-0 text-xs font-bold text-amber-600">150% min threshold</div>
            <div className="flex-1 relative h-2.5">
              <div className="absolute -top-1" style={{ left: `${((150 - 100) / 300) * 100}%` }}>
                <div className="w-0.5 h-5 bg-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
