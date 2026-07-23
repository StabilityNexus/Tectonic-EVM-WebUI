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
import { parseEther, formatEther } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { tectonicAbi } from "@/lib/abi/Tectonic";

// Mappings for different networks
const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  31337: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512", // Anvil
  11155111: "0x016eed9c27848d9ba152fe2d45dd2949f3f4780d", // Sepolia
};
const FALLBACK_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

function getContractAddress(chainId?: number): `0x${string}` {
  return chainId ? CONTRACT_ADDRESSES[chainId] || FALLBACK_ADDRESS : FALLBACK_ADDRESS;
}

/* ─── Shared mint/redeem form ─── */
function MintRedeemForm({
  mode,
  isEquity,
  inputAsset,
  outputToken,
  contractAddress,
  scPriceMint,
  scPriceRedeem,
  ecPriceMint,
  ecPriceRedeem,
}: {
  mode: "mint" | "redeem";
  isEquity: boolean;
  inputAsset: string;
  outputToken: string;
  contractAddress: `0x${string}`;
  scPriceMint: bigint;
  scPriceRedeem: bigint;
  ecPriceMint: bigint;
  ecPriceRedeem: bigint;
}) {
  const [amount, setAmount] = useState("");
  const isMint = mode === "mint";
  const t = useTranslations("common");

  // Determine the price based on mode and token
  let price = BigInt(0);
  if (isMint && !isEquity) price = scPriceMint;
  if (!isMint && !isEquity) price = scPriceRedeem;
  if (isMint && isEquity) price = ecPriceMint;
  if (!isMint && isEquity) price = ecPriceRedeem;

  const priceFormatted = Number(formatEther(price || BigInt(1)));
  
  // Calculate estimate based on price
  const valNum = parseFloat(amount || "0");
  let estimateNum = 0;
  if (priceFormatted > 0) {
    if (isMint) {
      estimateNum = valNum / priceFormatted; // e.g. 1000 WETH / 0.25 = 4000 TUSD
    } else {
      estimateNum = valNum * priceFormatted; // e.g. 4000 TUSD * 0.25 = 1000 WETH
    }
  }

  // Deduct 0.3% fee for display
  const feePct = 0.003;
  estimateNum = estimateNum * (1 - feePct);

  // Wagmi hooks
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(valNum) || valNum <= 0) return;
    const weiAmount = parseEther(amount);

    if (isMint && !isEquity) {
      writeContract({
        address: contractAddress,
        abi: tectonicAbi,
        functionName: "mint",
        value: weiAmount,
      });
    } else if (isMint && isEquity) {
      writeContract({
        address: contractAddress,
        abi: tectonicAbi,
        functionName: "mintEquityCoins",
        value: weiAmount,
      });
    } else if (!isMint && !isEquity) {
      writeContract({
        address: contractAddress,
        abi: tectonicAbi,
        functionName: "redeem",
        args: [weiAmount],
      });
    } else if (!isMint && isEquity) {
      writeContract({
        address: contractAddress,
        abi: tectonicAbi,
        functionName: "redeemEquityCoins",
        args: [weiAmount],
      });
    }
  };

  let btnText = isMint ? `${t("mint")} ${outputToken}` : `${t("redeem")} ${inputAsset}`;
  if (isPending) btnText = "Confirm in wallet...";
  if (isConfirming) btnText = "Processing...";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* input row */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">
          {isMint ? t("deposit") : t("burn")} {inputAsset}
        </label>
        <div className="relative">
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isPending || isConfirming}
            className="w-full rounded-xl border border-[#e7dac4] bg-[#fafaf8] px-4 py-3 pr-20 text-sm text-[#1a1a1a] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition disabled:opacity-50"
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
            ~{estimateNum > 0 ? estimateNum.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0.00"} {outputToken}
          </span>
        </div>
      </div>

      {/* action button */}
      <button
        type="submit"
        disabled={isPending || isConfirming || !amount}
        className={`w-full py-3 rounded-full text-sm font-bold tracking-wide transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
          isMint
            ? "bg-amber-400 hover:bg-amber-500 hover:-translate-y-0.5 text-[#1a1a1a] shadow-amber-100"
            : "border-2 border-amber-300 bg-white hover:bg-amber-50 hover:-translate-y-0.5 text-[#1a1a1a]"
        }`}
      >
        {btnText}
      </button>
      
      {isSuccess && (
        <div className="mt-2 text-center text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-lg border border-emerald-200">
          Transaction confirmed!
        </div>
      )}
    </form>
  );
}

/* ─── StableCoin card ─── */
function StableCoinCard({
  d,
  contractAddress,
  scPriceMint,
  scPriceRedeem,
}: {
  d: Deployment;
  contractAddress: `0x${string}`;
  scPriceMint: bigint;
  scPriceRedeem: bigint;
}) {
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
          <MintRedeemForm
            mode={tab}
            isEquity={false}
            inputAsset={tab === "mint" ? d.reserveAsset : d.stablecoin}
            outputToken={tab === "mint" ? d.stablecoin : d.reserveAsset}
            contractAddress={contractAddress}
            scPriceMint={scPriceMint}
            scPriceRedeem={scPriceRedeem}
            ecPriceMint={BigInt(0)}
            ecPriceRedeem={BigInt(0)}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── EquityCoin card ─── */
function EquityCoinCard({
  d,
  contractAddress,
  ecPriceMint,
  ecPriceRedeem,
}: {
  d: Deployment;
  contractAddress: `0x${string}`;
  ecPriceMint: bigint;
  ecPriceRedeem: bigint;
}) {
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
          <MintRedeemForm
            mode={tab}
            isEquity={true}
            inputAsset={tab === "mint" ? d.reserveAsset : d.equityCoin}
            outputToken={tab === "mint" ? d.equityCoin : d.reserveAsset}
            contractAddress={contractAddress}
            scPriceMint={BigInt(0)}
            scPriceRedeem={BigInt(0)}
            ecPriceMint={ecPriceMint}
            ecPriceRedeem={ecPriceRedeem}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function DeploymentDetailClient({ id }: { id: string }) {
  const tDetail = useTranslations("deploymentDetail");
  const tFooter = useTranslations("footer");

  // Wagmi Read Contracts (MUST be called before any early returns)
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId);

  const { data: scPriceMint } = useReadContract({
    address: contractAddress,
    abi: tectonicAbi,
    functionName: "scPriceMint",
  });
  const { data: scPriceRedeem } = useReadContract({
    address: contractAddress,
    abi: tectonicAbi,
    functionName: "scPriceRedeem",
  });
  const { data: ecPriceMint } = useReadContract({
    address: contractAddress,
    abi: tectonicAbi,
    functionName: "ecPriceMint",
  });
  const { data: ecPriceRedeem } = useReadContract({
    address: contractAddress,
    abi: tectonicAbi,
    functionName: "ecPriceRedeem",
  });
  const { data: ratioVal } = useReadContract({
    address: contractAddress,
    abi: tectonicAbi,
    functionName: "ratio",
  });

  const d = DEPLOYMENTS.find(x => x.id === id);
  if (!d) return notFound();

  // Inject real reserve ratio if available
  const displayRatio = ratioVal ? Number(ratioVal) / 100 : d.reserveRatio;
  const c = statusCfg(displayRatio > 100 ? "healthy" : d.status);

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
            <StableCoinCard
              d={d}
              contractAddress={contractAddress}
              scPriceMint={scPriceMint as bigint}
              scPriceRedeem={scPriceRedeem as bigint}
            />
            <EquityCoinCard
              d={d}
              contractAddress={contractAddress}
              ecPriceMint={ecPriceMint as bigint}
              ecPriceRedeem={ecPriceRedeem as bigint}
            />
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
                  {displayRatio}% <span className="text-base font-semibold text-gray-400">{tDetail("minSafe")}</span>
                </p>
                <div className="h-2.5 w-full rounded-full bg-[#efe2c9] overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${c.barColor}`}
                    style={{ width: pct(displayRatio) }}
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
                    <Link
                      href="/force-redemption"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping flex-shrink-0" />
                      {tDetail("triggerRedemptionCta")}
                    </Link>
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
                <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Logo.svg`} alt="Tectonic logo" width={140} height={40} className="logo-hover-zoom h-8 w-auto object-contain" />
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
