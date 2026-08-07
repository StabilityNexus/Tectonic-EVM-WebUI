"use client";

import React, { useState } from "react";

const FOOTNOTES: Record<string, string> = {
  "1": "Decentralization: absence of a single controlling party over the protocol.",
  "2": "Asset Backing: presence of assets that support the stablecoin's value.",
  "3": "In contrast to popular misbeliefs, seigniorage-share based stablecoins are not backed by seigniorage shares.",
  "4": "In contrast to popular misbeliefs, crypto-collateralized stablecoins are unbacked. The collateral is not a reserve. It is collateral for a loan that belongs to the borrower.",
  "5": "Lending Independence: the stablecoin does not require an underlying loan or debt position to exist.",
  "6": "A crypto-collateralized stablecoin is created only when a user opens a loan (CDP). Its existence directly depends on that debt position.",
  "7": "Transparency: public visibility of reserves or positions.",
  "8": "Knowing whether a fiat-backed stablecoin is sufficiently backed requires trusting the issuer or auditors.",
  "9": "Redemption Rights: ability to exchange the stablecoin for underlying assets.",
  "10": "Despite regulation requirements, fiat-backed stablecoin redemption at face value is usually limited to verified institutional partners. Retail users typically must rely on selling on open markets instead.",
  "11": "A crypto-collateralized stablecoin is a loan note. Only the original borrower can redeem it directly for the locked collateral. Other holders can claim collateral only by bidding during a liquidation event. Otherwise, they must rely on selling on open markets.",
  "12": "Leverage: ability to create a leveraged position using the model.",
  "13": "Crypto-collateralized stablecoins support leveraged long positions only indirectly. The borrower mints stablecoins and sells them for more of the collateral asset.",
  "14": "Crypto-backed stablecoins support leveraged long positions directly, through the minting of a separate coin that tokenizes the reserve surplus.",
  "15": "Tectonic inherits the same direct leverage approach of crypto-backed stablecoins. But, thanks to its greater capital efficiency, it offers greater leverage.",
  "16": "Minting: ability to mint new supply.",
  "17": "Minting fiat-backed stablecoin for fiat at face value is usually limited to verified institutional partners. Retail users typically must rely on buying on open markets instead.",
  "18": "Minting is only possible when the stablecoin's price is above the peg.",
  "19": "Minting is disabled when the reserve ratio is below a threshold.",
  "20": "Revenue Sources: where protocol income originates.",
  "21": "Revenue Beneficiaries: who receives that income.",
  "22": "Capital Efficiency: amount of stablecoin value created per unit of locked collateral.",
  "23": "Fiat-backing stablecoins are very capital efficient because the reserve assets are presumably very stable and thus the issuing company can maintain a reserve ratio close to 100%.",
  "24": "Seigniorage-share-based stablecoins are the most capital efficient of all because, being unbacked, they don't require capital at all.",
  "25": "Crypto-collateralized stablecoins are the most capital inefficient because the collateral surplus must remain locked and idle.",
  "26": "Crypto-backed stablecoins are more capital efficient than crypto-collateralized ones because their reserve surplus is tokenized and the reserve surplus tokens can be used freely and productively. Crypto-backed stablecoins are less capital efficient than fiat-backed stablecoins because their reserve assets are more volatile and thus a greater reserve ratio needs to be maintained in order to cushion against crashes in the reserve asset's price.",
  "27": "Tectonic is more capital efficient than other crypto-backed stablecoins because its greater resilience against depegging allows it to maintain a lower reserve ratio.",
  "28": "Depeg Resilience: ability of the model to prevent depegging or recover from depegging.",
  "29": "Although depegging is unlikely because the reserve investments are supposed to be safe, these investments may still fail and cause the reserve ratio to drop below 100%. In such an event, recovery is unlikely.",
  "30": "The Terra collapse shows that seigniorage-share-based stablecoins are unable to recover from depegging.",
  "31": "The liquidation mechanism allows quick recovery of the collateral ratio if it becomes dangerously low. This indirectly protects the peg. Stablecoins of this kind have already successfully withstood several market crashes.",
  "32": "Typical crypto-backed stablecoins maintain a large reserve ratio and are unlikely to depeg. Stablecoins of this kind have already successfully withstood several market crashes. However, if they depeg, recovery is difficult, to the lack of a liquidation-like mechanism. Recovery depends on recovery of the reserve asset or on the willingness of users to redeem stablecoins at discounted rates or to mint reserve surplus tokens at unfavorable prices.",
  "33": "Tectonic triggers automatic redemptions for a random selection of users if the reserve ratio becomes dangerously low. This is a liquidation-like mechanism that directly protects the reserve ratio and the peg. However, unlike in liquidations, users receive exactly the amount of reserve assets that their stablecoins were worth, without any penalty."
};

export function ComparisonTable() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const columns = [
    "Fiat-Backed",
    "Seigniorage-Share-Based",
    "Crypto-Collateralized",
    "Crypto-Backed",
    "Tectonic",
  ];

  const features = [
    { name: "Decentralization1", scores: ["❌", "✅", "✅", "✅", "✅"] },
    { name: "Asset Backing2", scores: ["✅", "❌3", "⚠️4", "✅", "✅"] },
    { name: "Lending Independence5", scores: ["✅", "✅", "❌6", "✅", "✅"] },
    { name: "Transparency7", scores: ["❌8", "✅", "✅", "✅", "✅"] },
    { name: "Redemption Rights9", scores: ["⚠️10", "❌", "⚠️11", "✅", "✅"] },
    { name: "Leverage12", scores: ["❌", "❌", "✅13", "✅14", "✅15"] },
    { name: "Minting16", scores: ["⚠️17", "⚠️18", "✅", "⚠️19", "✅"] },
    { name: "Revenue Sources20", scores: ["Reserve asset yield (e.g., treasury bills)", "Seigniorage from new coin issuance above peg", "Loan interest and liquidation fees", "Minting/redemption fees", "Minting/redemption/stability fees"] },
    { name: "Revenue Beneficiaries21", scores: ["Issuing company", "Seigniorage share holders", "Liquidators", "Holders of Tokenized Equity", "Holders of EquityCoins"] },
    { name: "Capital Efficiency22", scores: ["⭐⭐⭐⭐23", "⭐⭐⭐⭐⭐24", "⭐25", "⭐⭐26", "⭐⭐⭐27"] },
    { name: "Depeg Resilience28", scores: ["⭐⭐29", "⭐30", "⭐⭐⭐⭐31", "⭐⭐⭐32", "⭐⭐⭐⭐⭐33"] },
  ];

  const renderIcons = (str: string) => {
    if (str === '✅') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="inline-block w-5 h-5 text-emerald-500">
          <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
        </svg>
      );
    }
    if (str === '❌') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="inline-block w-5 h-5 text-rose-500">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      );
    }
    if (str === '⚠️' || str === '\u26A0\uFE0F' || str === '\u26A0') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="inline-block w-5 h-5 text-amber-500">
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
        </svg>
      );
    }
    if (str.includes('⭐')) {
      const starCount = (str.match(/⭐/g) || []).length;
      return (
        <span className="inline-flex">
          {Array.from({ length: starCount }).map((_, idx) => (
            <svg key={idx} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block w-5 h-5 text-amber-400">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          ))}
        </span>
      );
    }
    return str;
  };

  const formatText = (text: string, colIndex: number = -1) => {
    const match = text.match(/^(.*?)(\d+)$/);
    if (match) {
      const footnoteKey = match[2];
      const tooltipText = FOOTNOTES[footnoteKey];
      
      let tooltipPos = "left-1/2 -translate-x-1/2";
      let arrowPos = "left-1/2 -translate-x-1/2";
      
      if (colIndex === 0) {
        tooltipPos = "left-0";
        arrowPos = "left-4";
      } else if (colIndex >= 4) {
        tooltipPos = "right-0";
        arrowPos = "right-4";
      }

      return (
        <>
          {renderIcons(match[1])}
          <sup className="group relative inline-block cursor-help text-[11px] ml-[3px] text-amber-700/80 font-bold hover:text-amber-900 transition-colors z-10">
            {footnoteKey}
            {tooltipText && (
              <span className={`absolute bottom-[130%] ${tooltipPos} opacity-0 invisible translate-y-3 scale-95 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500 ease-out w-72 p-3.5 bg-[#FFC517] text-slate-900 text-xs rounded-xl shadow-[0_12px_35px_-5px_rgba(255,197,23,0.6)] z-[100] pointer-events-none whitespace-normal text-left font-semibold leading-relaxed`}>
                {tooltipText}
                <svg className={`absolute top-[calc(100%-1px)] ${arrowPos} w-4 h-4 text-[#FFC517]`} viewBox="0 0 10 10">
                  <path d="M0,0 L10,0 L5,5 Z" fill="currentColor" />
                </svg>
              </span>
            )}
          </sup>
        </>
      );
    }
    return <>{renderIcons(text)}</>;
  };

  return (
    <div className="w-full mt-12 overflow-x-auto pb-8 p-4">
      <div className="min-w-[1000px] bg-white/40 backdrop-blur-xl transition-all duration-500 ease-out rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/60 p-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-5 w-48 border-b border-r border-amber-300 bg-amber-200 rounded-tl-xl text-[13px] font-black text-amber-950 uppercase tracking-wider shadow-[inset_0_2px_0_rgba(251,191,36,0.3)]">
                Features
              </th>
              {columns.map((col, i) => {
                const isTectonic = i === columns.length - 1;
                const isEvenCol = i % 2 === 0;
                return (
                  <th
                    key={col}
                    onMouseEnter={() => setHoveredCol(i)}
                    onMouseLeave={() => setHoveredCol(null)}
                    className={`px-4 py-5 text-center text-[13px] font-bold leading-snug tracking-wide uppercase transition-all duration-300 ${
                      isTectonic
                        ? `bg-[#FFC517] text-[#1a1a1a] border-x-2 border-t-2 border-[#e6b115] shadow-[0_-4px_12px_rgba(255,197,23,0.35)] rounded-t-xl relative z-20 ${hoveredCol === i ? 'scale-[1.02] shadow-[0_-8px_20px_rgba(255,197,23,0.45)]' : ''}`
                        : `text-amber-900 border-b border-r border-amber-300/80 ${
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
                <tr key={feature.name} className={`hover:bg-amber-50/50 transition-colors duration-150 ${rowBg}`}>
                  <td
                    className={`px-6 py-5 text-sm font-bold text-amber-950 border-r border-amber-300/80 bg-amber-100/60 ${
                      isLastRow ? "border-b-0 rounded-bl-xl" : "border-b border-amber-200"
                    }`}
                  >
                    {formatText(feature.name, 0)}
                  </td>
                  {feature.scores.map((score, colIndex) => {
                    const isTectonic = colIndex === columns.length - 1;
                    const isEvenCol = colIndex % 2 === 0;

                    return (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        onMouseEnter={() => setHoveredCol(colIndex)}
                        onMouseLeave={() => setHoveredCol(null)}
                        className={`px-4 py-5 text-sm text-center relative transition-all duration-300 ${
                          isTectonic
                            ? `border-x-2 border-[#e6b115] text-slate-900 font-bold z-10 ${
                                hoveredCol === colIndex ? "bg-[#FFC517]/30 shadow-[0_4px_25px_rgba(255,197,23,0.25)] scale-[1.02]" : "bg-[#FFC517]/15 shadow-[0_4px_15px_rgba(255,197,23,0.1)]"
                              } ${isLastRow ? "border-b-2 rounded-b-xl" : "border-b border-[#FFC517]/40"}`
                            : `text-slate-700 border-r border-slate-200 ${
                                hoveredCol === colIndex ? "bg-amber-50/80" : isEvenCol ? "bg-slate-50/30" : "bg-transparent"
                              } ${isLastRow ? "border-b-0" : "border-b"}`
                        }`}
                      >
                        <span className="font-medium text-[13px] leading-relaxed">
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
  );
}
