"use client";

import { useState } from "react";
import { PageShell, DEPLOYMENTS, ReserveWidget, MRModal, statusCfg } from "@/app/deployments/page";
import type { Deployment } from "@/app/deployments/page";

export default function ForceRedemptionPage() {
  const [redeemTarget, setRedeemTarget] = useState<Deployment | null>(null);

  const dangerList  = DEPLOYMENTS.filter(d => d.status === "danger");
  const warningList = DEPLOYMENTS.filter(d => d.status === "warning");

  return (
    <>
      {redeemTarget && <MRModal mode="redeem" d={redeemTarget} onClose={() => setRedeemTarget(null)} />}

      <PageShell
        title="Force Redemption Monitor"
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
              <h4 className="font-bold text-red-700 text-sm">Force Redemption Active — {dangerList.map(d => d.name).join(", ")}</h4>
              <p className="text-red-600 text-xs mt-1">Reserve ratio has dropped below 150%. Stablecoin holders can redeem at 1:1 until the ratio recovers.</p>
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
          <h3 className="font-black text-slate-900 text-lg mb-4">How Force Redemption Works</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { icon:"📉", step:"01", title:"Ratio drops below 150%",  desc:"Oracle detects the reserve is undercollateralised relative to stablecoin supply." },
              { icon:"🔒", step:"02", title:"Equity minting halted",    desc:"No new equity coins can be issued while the ratio is below the safe threshold." },
              { icon:"🔄", step:"03", title:"Stablecoins redeemable 1:1",desc:"Holders can burn stablecoins at face value, withdrawing reserve assets directly." },
              { icon:"✅", step:"04", title:"Ratio restored",           desc:"As stablecoins are burned the ratio recovers and normal operations resume." },
            ].map(item => (
              <div key={item.step} className="rounded-2xl bg-amber-50 p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
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
            <p className="text-xs text-slate-500">Below this level equity minting pauses and force redemptions begin.</p>
            <div className="text-xs text-slate-500 mt-auto">
              Gap to safe ratio: <span className="text-red-600 font-bold">−30%</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-amber-100 p-5 shadow-sm flex flex-col gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Redemption Progress</div>
            <div className="text-4xl font-black text-violet-600">34%</div>
            <div className="text-xs text-slate-500">of eligible USDBN redeemed</div>
            <div className="h-2 w-full rounded-full bg-slate-100 mt-auto overflow-hidden">
              <div className="h-2 bg-violet-500 rounded-full" style={{ width: "34%" }} />
            </div>
          </div>
        </div>

        {/* full status table */}
        <div className="rounded-2xl bg-white border border-amber-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">All Deployment Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Contract", "Chain", "Reserve Ratio", "Safe Threshold", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DEPLOYMENTS.map(d => {
                  const c = statusCfg(d.status);
                  return (
                    <tr key={d.id} className="hover:bg-amber-50/30 transition">
                      <td className="px-5 py-4 font-semibold text-slate-900 whitespace-nowrap">{d.name}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ background: d.chainColor }} />
                          <span className="text-xs text-slate-600">{d.chain}</span>
                        </div>
                      </td>
                      <td className={`px-5 py-4 font-black whitespace-nowrap ${c.tc}`}>{d.reserveRatio}%</td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">150%</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${c.bbg} ${c.bt}`}>{c.dot} {c.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        {d.status === "danger"
                          ? <button onClick={() => setRedeemTarget(d)} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-200 transition whitespace-nowrap">Force Redeem</button>
                          : <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition whitespace-nowrap">Monitor</button>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* visual reserve ratio scale */}
        <div className="mt-6 rounded-2xl bg-white border border-amber-100 shadow-sm p-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-5">Reserve Ratio Scale</h3>
          <div className="space-y-4">
            {[
              { ratio: 350, status: "healthy" as const, label: "Ethereum — TUSD-ETH",  desc: "Well above the safety threshold" },
              { ratio: 287, status: "healthy" as const, label: "Base — USDB-BASE",     desc: "Healthy margin above threshold" },
              { ratio: 155, status: "warning" as const, label: "Polygon — USDP-POLY",  desc: "Approaching the 150% threshold — monitor" },
              { ratio: 120, status: "danger"  as const, label: "BSC — USDBN-BSC",      desc: "Below threshold — force redemption active" },
            ].map(item => {
              const c = statusCfg(item.status);
              const w = Math.min(100, Math.max(0, ((item.ratio - 100) / 300) * 100));
              return (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-36 flex-shrink-0">
                    <div className="text-xs font-bold text-slate-700 leading-tight">{item.label}</div>
                    <div className={`text-xs mt-0.5 ${c.tc}`}>{item.ratio}%</div>
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-3 rounded-full ${c.bar} transition-all duration-700`} style={{ width: `${w}%` }} />
                  </div>
                  <div className="w-28 text-xs text-slate-400 text-right hidden sm:block">{item.desc}</div>
                </div>
              );
            })}
            {/* threshold marker */}
            <div className="flex items-center gap-4 mt-2">
              <div className="w-36 flex-shrink-0 text-xs font-bold text-amber-600">150% threshold</div>
              <div className="flex-1 relative h-3">
                <div className="absolute" style={{ left: `${((150 - 100) / 300) * 100}%` }}>
                  <div className="w-0.5 h-5 bg-amber-400 -mt-1" />
                  <div className="text-[9px] text-amber-600 font-bold -mt-1 -translate-x-1/2">150%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}
