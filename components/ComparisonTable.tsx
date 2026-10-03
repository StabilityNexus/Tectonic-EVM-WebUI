"use client";

import React, { useState } from "react";
import { useTranslations } from "@/lib/i18n";

export function ComparisonTable() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const t = useTranslations("comparisonTable");

  const columns = [
    t("columns.fiatBacked"),
    t("columns.seigniorage"),
    t("columns.cryptoCollateralized"),
    t("columns.cryptoBacked"),
    t("columns.tectonic"),
  ];

  const features = [
    { name: t("features.decentralization") + "1", scores: ["❌", "✅", "✅", "✅", "✅"] },
    { name: t("features.assetBacking") + "2", scores: ["✅", "❌3", "⚠️4", "✅", "✅"] },
    { name: t("features.lendingIndependence") + "5", scores: ["✅", "✅", "❌6", "✅", "✅"] },
    { name: t("features.transparency") + "7", scores: ["❌8", "✅", "✅", "✅", "✅"] },
    { name: t("features.redemptionRights") + "9", scores: ["⚠️10", "❌", "⚠️11", "✅", "✅"] },
    { name: t("features.leverage") + "12", scores: ["❌", "❌", "✅13", "✅14", "✅15"] },
    { name: t("features.minting") + "16", scores: ["⚠️17", "⚠️18", "✅", "⚠️19", "✅"] },
    { name: t("features.revenueSources") + "20", scores: [t("textScores.reserveAssetYield"), t("textScores.seigniorageFromNewCoin"), t("textScores.loanInterest"), t("textScores.mintingRedemptionFees"), t("textScores.mintingRedemptionStabilityFees")] },
    { name: t("features.revenueBeneficiaries") + "21", scores: [t("textScores.issuingCompany"), t("textScores.seigniorageShareHolders"), t("textScores.liquidators"), t("textScores.holdersOfTokenizedEquity"), t("textScores.holdersOfEquityCoins")] },
    { name: t("features.capitalEfficiency") + "22", scores: ["⭐⭐⭐⭐23", "⭐⭐⭐⭐⭐24", "⭐25", "⭐⭐26", "⭐⭐⭐27"] },
    { name: t("features.depegResilience") + "28", scores: ["⭐⭐29", "⭐30", "⭐⭐⭐⭐31", "⭐⭐⭐32", "⭐⭐⭐⭐⭐33"] },
  ];

  const renderIcons = (str: string) => {
    if (str === "✅") {
      return (
        <>
          <span className="sr-only">{t("legend.yes")}</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="inline-block h-5 w-5 text-emerald-500">
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
        </>
      );
    }
    if (str === "❌") {
      return (
        <>
          <span className="sr-only">{t("legend.no")}</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="inline-block h-5 w-5 text-rose-500">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </>
      );
    }
    if (str === "⚠️" || str === "\u26A0\uFE0F" || str === "\u26A0") {
      return (
        <>
          <span className="sr-only">{t("legend.conditional")}</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="inline-block h-5 w-5 text-amber-500">
            <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
          </svg>
        </>
      );
    }
    if (str.includes("⭐")) {
      const starCount = (str.match(/⭐/g) || []).length;
      return (
        <>
          <span className="sr-only">{starCount} out of 5 stars</span>
          <span aria-hidden="true" className="inline-flex flex-wrap justify-end gap-0.5">
            {Array.from({ length: starCount }).map((_, idx) => (
              <svg key={idx} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block h-4 w-4 text-amber-400 sm:h-5 sm:w-5">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ))}
          </span>
        </>
      );
    }
    return str;
  };

  const formatText = (text: string, colIndex: number = -1, mobile = false) => {
    const match = text.match(/^(.*?)(\d+)$/);
    if (match) {
      const footnoteKey = match[2];
      const tooltipText = t(`footnotes.${footnoteKey}`);

      let tooltipPos = "left-1/2 -translate-x-1/2";
      let arrowPos = "left-1/2 -translate-x-1/2";

      if (mobile) {
        tooltipPos = "left-0 right-0 translate-x-0 mx-auto max-w-[min(18rem,calc(100vw-2.5rem))]";
        arrowPos = "left-1/2 -translate-x-1/2";
      } else if (colIndex === 0) {
        tooltipPos = "left-0";
        arrowPos = "left-4";
      } else if (colIndex >= 4) {
        tooltipPos = "right-0";
        arrowPos = "right-4";
      }

      return (
        <>
          {renderIcons(match[1])}
          <button
            type="button"
            aria-describedby={`footnote-tooltip-${footnoteKey}${mobile ? "-m" : ""}`}
            className="group relative z-10 ml-[3px] inline-block cursor-help text-[11px] font-bold text-amber-700/80 transition-colors hover:text-amber-900 focus-visible:text-amber-900 focus-visible:outline-none"
          >
            {footnoteKey}
            {tooltipText && tooltipText !== `footnotes.${footnoteKey}` && (
              <span
                id={`footnote-tooltip-${footnoteKey}${mobile ? "-m" : ""}`}
                role="tooltip"
                className={`pointer-events-none absolute bottom-[130%] z-[100] ${tooltipPos} w-[min(18rem,calc(100vw-2rem))] rounded-xl bg-[#FFC517] p-3.5 text-left text-xs font-semibold leading-relaxed whitespace-normal text-slate-900 opacity-0 invisible translate-y-3 scale-95 shadow-[0_12px_35px_-5px_rgba(255,197,23,0.6)] transition-all duration-500 ease-out group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100`}
              >
                {tooltipText}
                <svg className={`absolute top-[calc(100%-1px)] ${arrowPos} h-4 w-4 text-[#FFC517]`} viewBox="0 0 10 10" aria-hidden>
                  <path d="M0,0 L10,0 L5,5 Z" fill="currentColor" />
                </svg>
              </span>
            )}
          </button>
        </>
      );
    }
    return <>{renderIcons(text)}</>;
  };

  return (
    <div className="mt-8 w-full sm:mt-12">
      {/* --- MOBILE CARD LAYOUT (< md) --- */}
      <div className="space-y-3 md:hidden">
        {features.map((feature) => (
          <article
            key={`mobile-${feature.name}`}
            className="overflow-hidden rounded-2xl border border-amber-200/80 bg-white/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm"
          >
            <header className="border-b border-amber-200 bg-amber-100/80 px-3.5 py-3">
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700/80">
                {t("legend.feature")}
              </p>
              <h3 className="text-sm font-bold leading-snug text-amber-950">
                {formatText(feature.name, 0, true)}
              </h3>
            </header>

            <ul className="divide-y divide-amber-100/80">
              {columns.map((col, colIndex) => {
                const isTectonic = colIndex === columns.length - 1;
                const score = feature.scores[colIndex];
                const isIconScore = /^(✅|❌|⚠️|⭐+)/.test(score);

                return (
                  <li
                    key={`${feature.name}-${col}`}
                    className={`flex items-start gap-3 px-3.5 py-3 ${
                      isTectonic ? "bg-[#FFC517]/20" : "bg-white/50"
                    }`}
                  >
                    <span
                      className={`min-w-0 flex-1 text-left text-xs font-semibold leading-5 ${
                        isTectonic ? "text-[#1a1a1a]" : "text-amber-950/80"
                      }`}
                    >
                      {col}
                    </span>
                    <span
                      className={`max-w-[58%] shrink-0 text-right text-xs font-medium leading-5 ${
                        isTectonic ? "font-bold text-slate-900" : "text-slate-700"
                      } ${isIconScore ? "whitespace-nowrap" : "whitespace-normal break-words"}`}
                    >
                      {formatText(score, colIndex + 1, true)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      {/* --- DESKTOP / TABLET TABLE (>= md) --- */}
      <div className="hidden md:block w-full overflow-x-auto overscroll-x-contain pb-8 px-4 [-webkit-overflow-scrolling:touch]">
        <div className="min-w-[1000px] rounded-2xl border border-white/60 bg-white/40 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 ease-out">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-48 rounded-tl-xl border-b border-r border-amber-300 bg-amber-200 px-6 py-5 text-[13px] font-black uppercase tracking-wider text-amber-950 shadow-[inset_0_2px_0_rgba(251,191,36,0.3)]"
                >
                  {t("legend.feature")}
                </th>
                {columns.map((col, i) => {
                  const isTectonic = i === columns.length - 1;
                  const isEvenCol = i % 2 === 0;
                  return (
                    <th
                      scope="col"
                      key={col}
                      onMouseEnter={() => setHoveredCol(i)}
                      onMouseLeave={() => setHoveredCol(null)}
                      className={`px-4 py-5 text-center text-[13px] font-bold leading-snug tracking-wide uppercase transition-all duration-300 ${
                        isTectonic
                          ? `relative z-20 rounded-t-xl border-x-2 border-t-2 border-[#e6b115] bg-[#FFC517] text-[#1a1a1a] shadow-[0_-4px_12px_rgba(255,197,23,0.35)] ${hoveredCol === i ? "scale-[1.02] shadow-[0_-8px_20px_rgba(255,197,23,0.45)]" : ""}`
                          : `border-r border-b border-amber-300/80 text-amber-900 ${
                              hoveredCol === i ? "bg-amber-200 shadow-inner" : isEvenCol ? "bg-amber-100" : "bg-amber-50"
                            }`
                      }`}
                    >
                      {col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, rowIndex) => {
                const isLastRow = rowIndex === features.length - 1;
                const rowBg = rowIndex % 2 === 0 ? "bg-white/40" : "bg-slate-50/30";

                return (
                  <tr key={feature.name} className={`transition-colors duration-150 hover:bg-amber-50/50 ${rowBg}`}>
                    <th
                      scope="row"
                      className={`border-r border-amber-300/80 bg-amber-100/60 px-6 py-5 text-left text-sm font-bold text-amber-950 ${
                        isLastRow ? "rounded-bl-xl border-b-0" : "border-b border-amber-200"
                      }`}
                    >
                      {formatText(feature.name, 0)}
                    </th>
                    {feature.scores.map((score, colIndex) => {
                      const isTectonic = colIndex === columns.length - 1;
                      const isEvenCol = colIndex % 2 === 0;

                      return (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          onMouseEnter={() => setHoveredCol(colIndex)}
                          onMouseLeave={() => setHoveredCol(null)}
                          className={`relative px-4 py-5 text-center text-sm transition-all duration-300 ${
                            isTectonic
                              ? `z-10 border-x-2 border-[#e6b115] font-bold text-slate-900 ${
                                  hoveredCol === colIndex
                                    ? "scale-[1.02] bg-[#FFC517]/30 shadow-[0_4px_25px_rgba(255,197,23,0.25)]"
                                    : "bg-[#FFC517]/15 shadow-[0_4px_15px_rgba(255,197,23,0.1)]"
                                } ${isLastRow ? "rounded-b-xl border-b-2" : "border-b border-[#FFC517]/40"}`
                              : `border-r border-slate-200 text-slate-700 ${
                                  hoveredCol === colIndex ? "bg-amber-50/80" : isEvenCol ? "bg-slate-50/30" : "bg-transparent"
                                } ${isLastRow ? "border-b-0" : "border-b"}`
                          }`}
                        >
                          <span className="text-[13px] font-medium leading-relaxed">
                            {formatText(score, colIndex + 1)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
