"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import type { RatioStatus } from "@/lib/deployments-data";

export const CHART_DATA = {
  reserveRatio: [290, 305, 315, 298, 312, 320, 308, 315, 325, 318, 312, 322],
  stableSupply: [6.2, 6.8, 7.1, 7.4, 7.8, 8.0, 8.1, 8.2, 8.3, 8.35, 8.38, 8.4],
};

/* ─── Status — using site's amber palette for non-error states ─── */
export function statusCfg(s: RatioStatus) {
  if (s === "healthy")
    return {
      label: "Healthy",
      dotColor: "bg-emerald-500",
      tc: "text-emerald-700",
      badgeBg: "bg-emerald-50",
      badgeBorder: "border-emerald-200",
      badgeText: "text-emerald-700",
      barColor: "bg-emerald-500",
      cardBorder: "border-[#e7dac4]",
      headerBg: "bg-[#fbf6ec]",
    };
  if (s === "warning")
    return {
      label: "Warning",
      dotColor: "bg-amber-500",
      tc: "text-amber-700",
      badgeBg: "bg-amber-50",
      badgeBorder: "border-amber-300",
      badgeText: "text-amber-700",
      barColor: "bg-amber-400",
      cardBorder: "border-amber-300",
      headerBg: "bg-amber-50",
    };
  return {
    label: "Trigger Redemptions",
    dotColor: "bg-red-500",
    tc: "text-red-600",
    badgeBg: "bg-red-50",
    badgeBorder: "border-red-200",
    badgeText: "text-red-600",
    barColor: "bg-red-500",
    cardBorder: "border-red-200",
    headerBg: "bg-red-50",
  };
}

export function pct(ratio: number) {
  return `${Math.min(100, Math.max(0, ((ratio - 100) / 300) * 100))}%`;
}

/* ─── Sparkline ─── */
export function Sparkline({
  data,
  color = "#f59e0b",
  h = 48,
}: {
  data: number[];
  color?: string;
  h?: number;
}) {
  const W = 300,
    mn = Math.min(...data),
    mx = Math.max(...data),
    rng = mx - mn || 1;
  const pts = data.map(
    (v, i) =>
      `${(i / (data.length - 1)) * W},${h - ((v - mn) / rng) * (h - 8) - 4}`
  );
  const fp = `M ${pts[0]} ${pts
    .slice(1)
    .map((p) => `L ${p}`)
    .join(" ")} L ${W},${h} L 0,${h} Z`;
  const gid = `sg-${color.replace(/[^a-z0-9]/gi, "")}-${data[0]}-${
    data[data.length - 1]
  }`;
  return (
    <svg
      viewBox={`0 0 ${W} ${h}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: h }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fp} fill={`url(#${gid})`} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Reserve Widget — warm card matching site's feature cards ─── */
export function ReserveWidget({
  ratio,
  status,
  label,
}: {
  ratio: number;
  status: RatioStatus;
  label?: string;
}) {
  const c = statusCfg(status);
  return (
    <div
      className={`rounded-xl border ${c.cardBorder} bg-white p-4 flex flex-col gap-2.5 shadow-sm`}
    >
      {label && (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </div>
      )}
      <div className={`text-3xl font-bold leading-none ${c.tc}`}>{ratio}%</div>
      <div className="h-1.5 w-full rounded-full bg-[#efe2c9] overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${c.barColor}`}
          style={{ width: pct(ratio) }}
        />
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${c.dotColor}`} />
        <span className={c.tc}>{c.label}</span>
      </div>
    </div>
  );
}

/* ─── Shared page shell for sub-pages (equity / force-redemption) ─── */
export function PageShell({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-[68px] border-b border-[#e7dac4] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link
              href="/deployments"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition flex items-center gap-1 mb-3"
            >
              ← Back to Deployments
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
              {title}
            </h1>
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
                <Image
                  src="/Logo.svg"
                  alt="Tectonic logo"
                  width={160}
                  height={44}
                  className="logo-hover-zoom h-9 w-auto object-contain"
                />
                <span className="text-xl font-black tracking-[0.22em]">
                  TECTONIC
                </span>
              </div>
              <p className="max-w-xs text-sm leading-6 text-slate-600">
                Next-generation stablecoin protocol.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                Protocol
              </h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Docs", "Contracts", "GitHub"].map((l) => (
                  <li key={l}>
                    <a
                      href={
                        l === "GitHub"
                          ? "https://github.com/StabilityNexus/Tectonic-EVM-WebUI"
                          : "#"
                      }
                      target={l === "GitHub" ? "_blank" : undefined}
                      rel={
                        l === "GitHub" ? "noopener noreferrer" : undefined
                      }
                      className="transition hover:text-amber-700 hover:underline hover:underline-offset-4"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                Community
              </h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Discord", "Twitter"].map((l) => (
                  <li key={l}>
                    <a
                      href={
                        l === "Discord"
                          ? "https://discord.com/channels/995968619034984528/1503320626096635935"
                          : "#"
                      }
                      target={l === "Discord" ? "_blank" : undefined}
                      rel={
                        l === "Discord" ? "noopener noreferrer" : undefined
                      }
                      className="transition hover:text-amber-700 hover:underline hover:underline-offset-4"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-slate-700">
                {["Technical Paper"].map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="transition hover:text-amber-700 hover:underline hover:underline-offset-4"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-24 border-t border-amber-200/80 pt-6">
            <p className="text-center text-sm text-slate-600">
              © 2026 Tectonic Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
