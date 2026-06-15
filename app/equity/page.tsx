"use client";

import { PageShell, statusCfg } from "@/app/deployments/page";
import { DEPLOYMENTS } from "@/lib/deployments-data";

const EQUITY_COINS = [
  { name:"TEQT-ETH",  status:"healthy" as const, price:"$24.50", priceChange:"+2.3%", yield_:"6.2%", leverage:"3.25×", apr:"18.4%", supply:"45K", chain:"Ethereum", chainColor:"#627eea" },
  { name:"TEQT-ETH2", status:"healthy" as const, price:"$19.80", priceChange:"+1.1%", yield_:"5.8%", leverage:"4.1×",  apr:"16.2%", supply:"22K", chain:"Ethereum", chainColor:"#627eea" },
  { name:"TEQT-BASE", status:"healthy" as const, price:"$31.20", priceChange:"+1.8%", yield_:"7.0%", leverage:"2.87×", apr:"21.1%", supply:"31K", chain:"Base",     chainColor:"#0052ff" },
  { name:"TEQT-POLY", status:"warning" as const, price:"$4.10",  priceChange:"−12%",  yield_:"4.1%", leverage:"1.55×", apr:"8.3%",  supply:"18K", chain:"Polygon",  chainColor:"#8247e5" },
  { name:"TEQT-BSC",  status:"danger"  as const, price:"$0.82",  priceChange:"−88%",  yield_:"0.0%", leverage:"1.2×",  apr:"—",     supply:"4K",  chain:"BSC",      chainColor:"#f0b90b" },
];

export default function EquityPage() {
  return (
    <PageShell
      title="EquityCoins"
      subtitle="Protocol ownership tokens — earn yield from mint/redeem fees and hold leveraged exposure to reserve assets."
      badge={
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-3 py-1.5 self-start">
          💎 18.4% APR
        </span>
      }
    >
      {/* summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label:"TEQT Price",   value:"$24.50", color:"text-violet-600", sub:"+2.3% today" },
          { label:"Protocol APR", value:"18.4%",  color:"text-amber-600",  sub:"From fees"   },
          { label:"Avg Leverage", value:"3.25×",  color:"text-blue-600",   sub:"Reserve exposure" },
          { label:"Total Supply", value:"120K",   color:"text-slate-800",  sub:"All deployments"  },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white border border-amber-100 p-5 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{s.label}</div>
            <div className={`text-3xl font-black leading-none ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* explainer */}
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm mb-6">
        <h3 className="font-black text-slate-900 text-lg mb-3">How equity coins work</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon:"🏦", title:"Backed by reserve",   desc:"Each equity coin represents a leveraged claim on the protocol's reserve assets." },
            { icon:"💰", title:"Earn from every mint", desc:"0.3% of every mint and redemption flows to equity coin holders as yield." },
            { icon:"📈", title:"Leverage upside",      desc:"When reserve assets appreciate, equity coins amplify those gains via leverage." },
          ].map(item => (
            <div key={item.title} className="rounded-2xl bg-amber-50 p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-bold text-sm text-slate-900 mb-1">{item.title}</div>
              <p className="text-xs text-slate-600 leading-5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* equity coin cards */}
      <h3 className="font-black text-slate-900 text-lg mb-4">All EquityCoins</h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {EQUITY_COINS.map(eq => {
          const c = statusCfg(eq.status);
          return (
            <div key={eq.name} className={`rounded-2xl bg-white border ${c.cardBorder} shadow-sm overflow-hidden`}>
              {/* card header */}
              <div className={`px-5 py-4 ${c.headerBg} border-b ${c.cardBorder} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[9px] font-extrabold shadow-sm"
                    style={{ background: eq.chainColor }}>{eq.chain.slice(0, 3).toUpperCase()}</div>
                  <span className="font-black text-slate-900">{eq.name}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.badgeBg} ${c.badgeBorder} ${c.badgeText}`}><span className={`h-1.5 w-1.5 rounded-full inline-block ${c.dotColor}`} /> {c.label}</span>
              </div>

              <div className="px-5 py-5">
                {/* price */}
                <div className="text-center py-3 mb-4">
                  <div className={`text-4xl font-black ${eq.status === "danger" ? "text-red-500" : "text-violet-600"}`}>{eq.price}</div>
                  <div className={`text-xs font-semibold mt-1 ${eq.priceChange.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                    {eq.priceChange} today
                  </div>
                </div>

                {/* stat grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    ["Yield",    eq.yield_,    "text-amber-600"  ],
                    ["Leverage", eq.leverage,  "text-blue-600"   ],
                    ["APR",      eq.apr,        "text-emerald-600"],
                    ["Supply",   eq.supply,     "text-slate-800"  ],
                  ].map(([k, v, col]) => (
                    <div key={k} className="rounded-xl bg-slate-50 p-3 text-center">
                      <div className={`text-base font-black ${col}`}>{v}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{k}</div>
                    </div>
                  ))}
                </div>

                {/* actions */}
                <div className="flex gap-2">
                  {eq.status === "danger" ? (
                    <button className="flex-1 py-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-200 transition uppercase tracking-wider">
                      Exit Position
                    </button>
                  ) : (
                    <>
                      <button className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold uppercase tracking-wider transition">Buy</button>
                      <button className="flex-1 py-2.5 rounded-xl border border-amber-200 bg-white text-amber-700 text-xs font-bold uppercase tracking-wider hover:bg-amber-50 transition">Sell</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* per-deployment yield table */}
      <div className="mt-8 rounded-2xl bg-white border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Yield by Deployment</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Deployment","Chain","Total Reserve","Equity Yield","Reserve Ratio","Equity Supply"].map(h=>(
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
                        <div className="h-3.5 w-3.5 rounded-full" style={{ background: d.chainColor }} />
                        <span className="text-xs text-slate-600">{d.chain}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium whitespace-nowrap">{d.totalReserve}</td>
                    <td className="px-5 py-4 font-black text-amber-600 whitespace-nowrap">{d.equityYield}%</td>
                    <td className={`px-5 py-4 font-black whitespace-nowrap ${c.tc}`}>{d.reserveRatio}%</td>
                    <td className="px-5 py-4 text-slate-700 font-medium whitespace-nowrap">{d.equitySupply}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
