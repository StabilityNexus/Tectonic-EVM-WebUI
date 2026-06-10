"use client";

import { useState } from "react";
import { PageShell } from "@/app/deployments/page";

/* ─── animated payment flow ─── */
function PaymentFlow() {
  const [step,    setStep]    = useState(0);
  const [running, setRunning] = useState(false);
  const [method,  setMethod]  = useState<"eth" | "stable">("eth");
  const [amount,  setAmount]  = useState("1000");

  const start = () => {
    setRunning(true); setStep(1);
    setTimeout(() => setStep(2), 900);
    setTimeout(() => setStep(3), 1900);
    setTimeout(() => setStep(4), 3200);
  };
  const reset = () => { setStep(0); setRunning(false); };

  const steps = [
    { n: 1, icon: "💳", label: "Customer Pays with ETH",    detail: () => <p className="text-xs text-slate-500 mt-0.5">0.003158 ETH → ₹{amount} via {method === "eth" ? "ETH" : "Stablecoin"}</p> },
    { n: 2, icon: "⟳",  label: "Convert ETH → TUSD",         detail: () => <div className="flex gap-2 flex-wrap mt-1">{["Oracle: $3,800", "Ratio: 325%"].map(t => <span key={t} className="text-[10px] bg-white border border-slate-100 rounded px-2 py-0.5 text-slate-500">{t}</span>)}<span className="text-[10px] bg-amber-100 text-amber-700 rounded px-2 py-0.5">Fee 0.3%</span></div> },
    { n: 3, icon: "⚡", label: "Payment Processing",          detail: () => <div className="text-xs text-slate-500 mt-1 space-y-0.5"><div>● ETH deposited to reserve vault</div><div>↓ TUSD minted by protocol</div><div>↓ Settlement sent to merchant</div></div> },
    { n: 4, icon: "✓",  label: "Payment Successful",          detail: () => <div className="mt-1"><p className="text-xs font-semibold text-emerald-600">Paid ₹{amount} ✓</p><p className="text-xs text-slate-500 mt-0.5">Tx: <span className="font-mono">0x1a2b3c4d…</span></p><a href="#" className="text-xs text-amber-600 hover:underline">View on Explorer →</a></div> },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* checkout card */}
      <div className="rounded-2xl bg-white border border-amber-100 shadow-[0_6px_20px_rgba(15,23,42,0.07)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-amber-50/50">
          <h4 className="font-bold text-slate-900">Checkout</h4>
          <p className="text-xs text-slate-400 mt-0.5">Merchant: TechStore India</p>
        </div>
        <div className="px-6 py-6 space-y-5">
          {/* amount */}
          <div className="text-center py-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Pay Amount</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-black text-amber-500">₹</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                disabled={running}
                className="text-5xl font-black text-amber-500 bg-transparent border-none outline-none w-32 text-center"
              />
            </div>
            <div className="text-sm text-slate-400 mt-1">≈ ${(parseFloat(amount || "0") * 0.012).toFixed(2)} USD</div>
          </div>

          {/* method */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Payment Method</div>
            <div className="flex gap-3">
              {(["eth", "stable"] as const).map(m => (
                <label key={m} className={`flex-1 flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition ${method === m ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <input type="radio" name="pm" checked={method === m} onChange={() => setMethod(m)} disabled={running} className="accent-amber-500" />
                  <span className="text-sm font-semibold text-slate-700">{m === "eth" ? "🔷 ETH" : "💵 Stablecoin"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={step === 0 ? start : reset}
            disabled={running && step < 4}
            className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition ${
              step === 4 ? "bg-emerald-400 hover:bg-emerald-500 text-white"
              : running && step < 4 ? "bg-amber-200 text-amber-400 cursor-not-allowed"
              : "bg-amber-400 hover:bg-amber-500 text-black"
            }`}
          >
            {step === 0 ? "Continue →" : step === 4 ? "New Payment ↺" : "Processing…"}
          </button>

          {step === 4 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center animate-fade-up">
              <div className="text-3xl mb-1">✅</div>
              <div className="font-black text-emerald-700 text-sm">Payment Successful</div>
              <div className="text-xs text-slate-500 mt-1 font-mono">Tx: 0x1a2b3c4d5e6f…</div>
              <a href="#" className="text-xs text-amber-600 hover:underline mt-1 block">View on Explorer →</a>
            </div>
          )}
        </div>
      </div>

      {/* animated steps */}
      <div className="flex flex-col justify-center gap-0">
        {steps.map((s, i) => {
          const active = step >= s.n;
          const done   = step > s.n || (s.n === 4 && step >= 4);
          return (
            <div key={s.n} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-500 ${
                  done   ? "bg-emerald-400 text-white shadow-lg"
                  : active ? "bg-amber-400 text-black shadow-lg scale-110"
                  : "bg-slate-100 text-slate-400"
                }`}>
                  {done ? "✓" : s.icon}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-7 mt-1 transition-all duration-500 ${active ? "bg-amber-300" : "bg-slate-200"}`} />
                )}
              </div>
              <div className={`flex-1 rounded-xl border p-3.5 mb-2 transition-all duration-500 ${
                active && s.n === 4 ? "border-emerald-200 bg-emerald-50"
                : active ? "border-amber-200 bg-amber-50"
                : "border-slate-100 bg-white opacity-40"
              }`}>
                <div className="font-semibold text-sm text-slate-800">{s.label}</div>
                {active && s.detail()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function StablePayPage() {
  return (
    <PageShell
      title="StablePay"
      subtitle="Pay with any native asset. Tectonic converts it to a stablecoin at checkout — merchants receive stable value, customers pay with what they hold."
      badge={
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 self-start">
          💳 Live Demo
        </span>
      }
    >
      {/* value props */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon:"🔷", title:"Pay with ETH",           desc:"Customers use native assets without worrying about stablecoin acquisition." },
          { icon:"🔄", title:"Auto-convert via oracle", desc:"The protocol fetches the live price and mints exactly the right amount of TUSD." },
          { icon:"💵", title:"Merchant gets stables",   desc:"Merchants receive predictable stablecoin settlement, zero slippage exposure." },
        ].map(item => (
          <div key={item.title} className="rounded-2xl bg-white border border-amber-100 p-5 shadow-sm">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-bold text-sm text-slate-900 mb-1">{item.title}</div>
            <p className="text-xs text-slate-500 leading-5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* interactive flow */}
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900 mb-2">Interactive Payment Demo</h2>
        <p className="text-slate-500 text-sm mb-5">Edit the amount, pick a payment method, then click Continue to watch the flow animate.</p>
        <PaymentFlow />
      </div>

      {/* how it works */}
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm mb-6">
        <h3 className="font-black text-slate-900 text-lg mb-5">Technical Flow</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { n:"01", title:"ETH sent to contract",   desc:"Customer triggers the payment transaction from their wallet." },
            { n:"02", title:"Oracle queries price",    desc:"Chainlink or equivalent fetches live ETH/USD at the moment of payment." },
            { n:"03", title:"Reserve ratio checked",   desc:"Protocol verifies minting won't push reserve below the safe threshold." },
            { n:"04", title:"TUSD minted & settled",   desc:"Stablecoins are minted at 0.3% fee and transferred directly to the merchant." },
          ].map(s => (
            <div key={s.n} className="rounded-2xl bg-amber-50 p-4">
              <div className="text-2xl font-black text-amber-300 mb-2">{s.n}</div>
              <div className="font-bold text-sm text-slate-800 mb-1">{s.title}</div>
              <p className="text-xs text-slate-500 leading-5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* fee table */}
      <div className="rounded-2xl bg-white border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Fee Structure</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Action", "Fee", "Recipient", "Notes"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                ["Mint (StablePay)",  "0.3%", "Equity coin holders", "Taken from minted stablecoin amount"],
                ["Redeem",           "0.3%", "Equity coin holders", "Taken from returned reserve asset"],
                ["Force Redemption", "0.0%", "—",                   "No fee during crisis mode"],
              ].map(([action, fee, recipient, notes]) => (
                <tr key={action} className="hover:bg-amber-50/30 transition">
                  <td className="px-5 py-4 font-semibold text-slate-900">{action}</td>
                  <td className="px-5 py-4 font-black text-amber-600">{fee}</td>
                  <td className="px-5 py-4 text-slate-600 text-xs">{recipient}</td>
                  <td className="px-5 py-4 text-slate-400 text-xs">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
