"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import type { CSSProperties } from 'react';
import Navbar from "@/components/Navbar";
import { DEPLOYMENTS, getProtocolStats } from "@/lib/deployments-data";
import { pct, statusCfg } from "@/lib/deployments-ui";
import { useTranslations } from "@/lib/i18n";

function Typewriter({ text, className = "", speed = 45 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [visibleText, setVisibleText] = useState("");
  const started = useRef(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const node = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            let i = 0;
            intervalRef.current = window.setInterval(() => {
              i += 1;
              setVisibleText(text.slice(0, i));
              if (i >= text.length) {
                if (intervalRef.current !== null) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }
            }, speed);
          }
        });
      },
      { threshold: 0.5 }
    );

    obs.observe(node);
    return () => {
      obs.disconnect();
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed]);

  return (
    <h2 ref={ref} className={className}>
      <span>{visibleText}</span>
      <span className="ml-1 inline-block animate-pulse">▌</span>
    </h2>
  );
}

function HeroTypewriter({
  text,
  className = "",
  speed = 75,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      <span className="whitespace-pre-line">{visibleText}</span>
      <span className="ml-1 inline-block animate-pulse">▌</span>
    </span>
  );
}

function CountUpValue({
  end,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2400,
  className = "",
}: {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = window.performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
const tectonicLetters = 'TECTONIC'.split('');

export default function Home() {
  const router = useRouter();
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");
  const tDetail = useTranslations("deploymentDetail");
  const tFooter = useTranslations("footer");

  // Features data and reveal animation refs
  const features = [
    {
      title: tHome("whyTectonicFeatures.triggerRedemptions.title"),
      emoji: '⚡',
      desc: tHome("whyTectonicFeatures.triggerRedemptions.desc"),
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      title: tHome("whyTectonicFeatures.secureBaseLayer.title"),
      emoji: '🔒',
      desc: tHome("whyTectonicFeatures.secureBaseLayer.desc"),
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      title: tHome("whyTectonicFeatures.evmCompatible.title"),
      emoji: '🌐',
      desc: tHome("whyTectonicFeatures.evmCompatible.desc"),
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: tHome("whyTectonicFeatures.defiIntegration.title"),
      emoji: '💱',
      desc: tHome("whyTectonicFeatures.defiIntegration.desc"),
      color: 'from-pink-400 to-pink-500'
    }
  ];

  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);

  const protocolStats = useMemo(() => {
    const stats = getProtocolStats(DEPLOYMENTS);
    return [
      { value: stats.avgReserveRatio, label: tHome("stats.avgReserveRatio"), prefix: "", suffix: "%", decimals: 0 },
      { value: stats.totalStablecoinSupplyM, label: tHome("stats.stablecoinSupply"), prefix: "", suffix: "M", decimals: 1 },
      { value: stats.avgLeverage, label: tHome("stats.avgLeverage"), prefix: "", suffix: "x", decimals: 1 },
    ];
  }, [tHome]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {});
        }
      }
    };
    handleMotionPreference(mediaQuery);
    mediaQuery.addEventListener('change', handleMotionPreference);
    return () => mediaQuery.removeEventListener('change', handleMotionPreference);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    featureRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden pt-0">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-orbital overflow-visible pt-24 pb-16">
        {/* Enhanced Orbital Background with Animated Glows */}
        <div className="orbital-container">
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-2"></div>
          <div className="glow-orb glow-orb-3"></div>
          
        </div>

        <div className="z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-left">
            <div className="mb-8 inline-block">
              <span className="hero-kicker text-sm font-semibold text-yellow-500">{tHome("kicker")}</span>
            </div>

            <h1 className="hero-title mb-6 max-w-6xl text-5xl font-bold leading-tight text-gray-900 md:text-7xl">
              <span className="hero-title-line hero-title-line-first max-w-5xl md:text-[4.6rem] md:leading-[1.02]">
                <HeroTypewriter
                  text={tHome("title")}
                  className="block"
                />
              </span>
              <span className="hero-title-line hero-title-line-second hero-title-accent">
                With{' '}
                <span className="animated-word hero-word-inline" aria-label="TECTONIC">
                  {tectonicLetters.map((letter, index) => (
                    <span
                      key={`hero-${letter}-${index}`}
                      className="hero-letter"
                      style={{ '--letter-delay': `${index * 0.35}s` } as CSSProperties}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p className="mb-12 max-w-2xl text-lg text-gray-600 md:text-xl">
              {tHome("description")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
              <button className="btn-primary text-lg">{tHome("startBuilding")}</button>
              <button className="btn-secondary text-lg">{tHome("learnMore")}</button>
            </div>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-sm md:mt-0 md:absolute hero-visual md:w-[min(85vw,950px)] hero-visual-lg lg:w-[min(90vw,1200px)] lg:max-w-none">
            <div className="relative aspect-[4/3] w-full drop-shadow-2xl md:aspect-[5/4]">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/tectonic-hero.png`}
                alt="Tectonic hero illustration"
                fill
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 85vw, 90vw"
                className="object-contain object-right-bottom p-0 scale-x-[-1]"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-orange-600">↓</div>
        </div>
      </section>

      {/* Features Section (styled to match provided design) */}
      <section id="learn" className="py-20 px-6 bg-[#fbf6ec]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-5xl font-sans mb-3 text-gray-900">
              <span className="mr-2">{tHome("why")}</span>
              <span className="text-yellow-600">{tHome("tectonicQ")}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-700 text-lg">{tHome("whyTectonicDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {features.map((f, i) => (
              <div key={f.title} className="w-full h-full">
                <div
                  ref={(el) => { featureRefs.current[i] = el }}
                  style={{ transitionDelay: `${i * 120}ms` }}
                  className="relative rounded-xl border border-[#e7dac4] bg-[#fbf6ec] p-6 transform transition-all duration-700 opacity-0 translate-y-6 hover:-translate-y-1 hover:shadow-lg h-full"
                >
                  {/* inner white panel for contrast */}
                  <div className="relative bg-white rounded-lg pt-20 px-6 pb-6 min-h-[220px] shadow-sm flex flex-col justify-between h-full">
                    <div className="absolute top-4 left-4 w-14 h-14 rounded-full bg-white border border-[#efe2c9] flex items-center justify-center text-2xl shadow-sm">
                      <span className="leading-none">{f.emoji}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{f.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{f.desc}</p>

                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href="#" className="text-yellow-600 font-medium hover:underline">{tHome("learnMoreLink")}</a>
                    </div>

                    <svg className="absolute right-4 bottom-4 opacity-20" width="72" height="36" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M2 30 C20 10, 60 10, 78 30" stroke="#e6d7c1" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="14" cy="28" r="1.2" fill="#e6d7c1" />
                      <circle cx="38" cy="20" r="1.2" fill="#e6d7c1" />
                      <circle cx="62" cy="12" r="1.2" fill="#e6d7c1" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <a href="#" className="inline-block rounded-full border border-[#e7dac4] px-6 py-3 text-lg tracking-wide text-gray-900 font-medium hover:bg-[#fffaf0] animate-fade-up transition-transform duration-200 hover:-translate-y-1 hover:scale-105">{tHome("learnMoreLink")}</a>
          </div>
        </div>
      </section>

      {/* StableCoin Panel (inserted after learn) */}
      <section className="py-12 px-6 bg-white">
        <div className="mx-auto max-w-7xl px-0">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="rounded-2xl flex items-center justify-center bg-white">
              <video
                ref={videoRef}
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/effect.mp4`}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="w-full max-w-full rounded-2xl md:h-[380px] object-contain"
              />
            </div>

            <div>
              <Typewriter 
                text={tHome("futurePayments")} 
                className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 whitespace-pre-line leading-tight" 
                speed={120} 
              />
              <p className="mt-6 max-w-xl text-xl leading-9 text-gray-700">
                {tHome("futurePaymentsDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployments Panel */}
      <section id="explore" className="bg-[#fdf7ef] pt-12 pb-20">
        <div className="-mt-14 w-full border-y-2 border-amber-200 bg-white py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(251,191,36,0.14)]">
          <div className="mx-auto max-w-[1440px] px-6">
            <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-3">
              {protocolStats.map((stat) => (
                <div key={stat.label} className="px-2 py-2">
                  <div className="text-3xl font-bold tracking-tight text-slate-900 md:text-[2rem]">
                    <CountUpValue
                      end={stat.value}
                      decimals={stat.decimals ?? 0}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="mt-1 text-sm font-medium leading-6 text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1440px] px-6">
          <div className="mb-8 max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.22em] text-amber-600 uppercase">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">◎</span>
              {tHome("activeDeployments")}
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{tHome("liveOnLeadingChains")}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {tHome("liveOnLeadingChainsDesc")}
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <table className="w-full table-fixed border-collapse text-left">
                <colgroup>
                  <col className="w-[26%]" />
                  <col className="w-[17%]" />
                  <col className="w-[12%]" />
                  <col className="w-[14%]" />
                  <col className="w-[14%]" />
                  <col className="w-[11%]" />
                  <col className="w-[6%]" />
                </colgroup>
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <th className="px-6 py-5">{tHome("activeDeployments").split(" ")[1] || "Deployment"}</th>
                      <th className="px-6 py-5">Chain</th>
                      <th className="px-6 py-5">Reserve Asset</th>
                      <th className="px-6 py-5">{tDetail("reserveRatio")}</th>
                      <th className="px-6 py-5">{tCommon("stablecoinSupply")}</th>
                      <th className="px-6 py-5">TVL</th>
                      <th className="px-5 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DEPLOYMENTS.map((deployment, index) => {
                      const status = statusCfg(deployment.status);
                      return (
                        <tr
                          key={deployment.id}
                          onClick={() => router.push(`/deployments/${deployment.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              router.push(`/deployments/${deployment.id}`);
                            }
                          }}
                          tabIndex={0}
                          role="link"
                          aria-label={`View ${deployment.name} deployment`}
                          className="group cursor-pointer transition-colors hover:bg-amber-50/40"
                        >
                          <td className="px-6 py-6 align-middle">
                            <div className="flex items-center gap-4">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                                style={{ background: deployment.chainColor }}
                              >
                                {index % 3 === 0 ? "◈" : index % 3 === 1 ? "◌" : "⬢"}
                              </div>
                              <div>
                                <div className="text-sm font-semibold leading-5 text-slate-900">{deployment.name}</div>
                                <div className="text-xs leading-4 text-slate-500">{deployment.stablecoin}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 align-middle">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 whitespace-nowrap">
                              <span
                                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                style={{ background: deployment.chainColor }}
                              >
                                {deployment.chainShort.slice(0, 3)}
                              </span>
                              {deployment.chain}
                            </div>
                          </td>
                          <td className="px-6 py-6 align-middle">
                            <div className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                              {deployment.reserveAsset}
                            </div>
                          </td>
                          <td className="px-6 py-6 align-middle">
                            <div className="w-full max-w-[130px]">
                              <div className={`mb-2 text-sm font-semibold ${status.tc}`}>
                                {deployment.reserveRatio}%
                              </div>
                              <div className="h-2 rounded-full bg-slate-200">
                                <div
                                  className={`h-2 rounded-full ${status.barColor}`}
                                  style={{ width: pct(deployment.reserveRatio) }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 align-middle text-sm font-semibold text-slate-800 whitespace-nowrap">
                            {deployment.stableSupply} {deployment.stablecoin}
                          </td>
                          <td className="px-6 py-6 align-middle text-sm font-semibold text-slate-800 whitespace-nowrap">{deployment.tvl}</td>
                          <td className="px-5 py-6 align-middle text-right text-slate-400">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full transition group-hover:bg-white group-hover:text-slate-700">›</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
            </div>

            <aside className="relative overflow-hidden rounded-[2rem] border border-amber-100/80 bg-gradient-to-b from-white via-white/90 to-amber-50/40 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-amber-100/60 backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-200/35 blur-3xl"></div>
              <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-white/60 blur-2xl"></div>
              <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>

              <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-amber-50 via-white to-amber-100 text-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_36px_rgba(251,191,36,0.18)] ring-1 ring-white/80">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 2l7 3v6c0 5-3.4 9.6-7 11-3.6-1.4-7-6-7-11V5l7-3z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9.5 12.2l1.9 1.9 3.6-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="max-w-xs text-2xl font-bold tracking-tight text-slate-900 drop-shadow-sm">{tHome("stabilityPaymentsTitle")}</h3>
              <p className="mt-5 max-w-sm text-base leading-8 text-slate-600">
                {tHome("stabilityPaymentsDesc")}
              </p>

              <a href="#" className="mt-10 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/90 px-4 py-2 text-base font-semibold text-amber-600 shadow-[0_12px_28px_rgba(251,191,36,0.12)] transition hover:-translate-y-0.5 hover:bg-white hover:text-amber-700 hover:shadow-[0_16px_34px_rgba(251,191,36,0.18)]">
                {tHome("learnMoreAboutTectonic")}
                <span aria-hidden>→</span>
              </a>
            </aside>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/deployments"
              className="btn-primary btn-hero group flex h-11 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold tracking-wide"
            >
              <span>{tHome("viewAllDeployments")}</span>
              <svg
                className="w-4 h-4 flex-shrink-0 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                viewBox="0 0 24 24" fill="none" aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Protocol Overview — horizontal flow */}
      <section id="build" className="py-20 px-6 bg-[#fbf6ec]">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-100 bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] md:p-12">
          <h2 className="text-center text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">{tHome("howItWorks")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-slate-600 md:text-lg">
            {tHome("howItWorksDesc")}
          </p>

          <div className="mt-12 rounded-[1.75rem] border border-amber-100 bg-gradient-to-b from-[#fffdf8] to-[#fff7eb] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] md:p-8">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">

              <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-sm flex flex-col">
                <div className="mx-auto mb-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-600 shadow-inner">1</div>
                <h3 className="text-base font-semibold text-slate-900">{tHome("howItWorksSteps.1.title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 flex-1">{tHome("howItWorksSteps.1.desc")}</p>
              </div>

              <div className="flex items-center justify-center text-3xl font-light text-amber-300 md:px-1 flex-shrink-0">→</div>

              <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-sm flex flex-col">
                <div className="mx-auto mb-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-600 shadow-inner">2</div>
                <h3 className="text-base font-semibold text-slate-900">{tHome("howItWorksSteps.2.title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 flex-1">{tHome("howItWorksSteps.2.desc")}</p>
              </div>

              <div className="flex items-center justify-center text-3xl font-light text-amber-300 md:px-1 flex-shrink-0">→</div>

              <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-sm flex flex-col">
                <div className="mx-auto mb-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-600 shadow-inner">3</div>
                <h3 className="text-base font-semibold text-slate-900">{tHome("howItWorksSteps.3.title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 flex-1">{tHome("howItWorksSteps.3.desc")}</p>
              </div>

              <div className="flex items-center justify-center text-3xl font-light text-amber-300 md:px-1 flex-shrink-0">→</div>

              <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-sm flex flex-col">
                <div className="mx-auto mb-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-600 shadow-inner">4</div>
                <h3 className="text-base font-semibold text-slate-900">{tHome("howItWorksSteps.4.title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 flex-1">{tHome("howItWorksSteps.4.desc")}</p>
              </div>

            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="#" className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-6 py-3 text-base font-medium tracking-wide text-gray-900 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-amber-50">
              {tHome("readTechnicalPaper")}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="relative py-20 px-6 bg-white border-t border-yellow-200 overflow-hidden">
        {/* subtle theme-consistent blobs */}
        <div className="pointer-events-none absolute -left-12 -top-8 h-40 w-40 rounded-full bg-yellow-200 opacity-30 blur-2xl"></div>
        <div className="pointer-events-none absolute -right-12 top-20 h-44 w-44 rounded-full bg-indigo-100 opacity-20 blur-2xl"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="relative inline-block mb-4" style={{display: 'inline-block'}}>
                <h2 className="community-title text-4xl md:text-5xl font-semibold relative z-10 tracking-tight">{tHome("joinCommunity")}</h2>
              </div>
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                {tHome("joinCommunityDesc")}
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="inline-flex flex-col gap-4 rounded-3xl bg-white p-3 shadow-lg">
                <a href="#" className="btn-primary flex items-center gap-3 px-4 py-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M20 3H4a1 1 0 00-1 1v16l4-4h13a1 1 0 001-1V4a1 1 0 00-1-1z" fill="currentColor" />
                  </svg>
                  DISCORD
                </a>

                <a href="#" className="btn-secondary flex items-center gap-3 px-4 py-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M22 5.92a8.3 8.3 0 01-2.36.65A4.1 4.1 0 0021.4 4c-.8.48-1.68.82-2.62 1A4.13 4.13 0 0012 8.4v.5A11.7 11.7 0 013 6.16a4.03 4.03 0 001.28 5.48 4.08 4.08 0 01-1.86-.51v.05c0 1.9 1.34 3.5 3.12 3.87a4.1 4.1 0 01-1.85.07 4.12 4.12 0 003.85 2.86A8.3 8.3 0 012 19.54 11.68 11.68 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.18 8.18 0 0022 5.92z" fill="currentColor"/>
                  </svg>
                  TWITTER
                </a>

                <a href="#" className="btn-secondary flex items-center gap-3 px-4 py-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.6.4-1.1.7-1.4-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3.7.9 1.2 2 1.2 3.3 0 4.5-2.7 5.4-5.3 5.8.4.4.8 1 1 2v3c0 .3.2.7.8.6A10.5 10.5 0 0023.5 12C23.5 5.7 18.3.5 12 .5z" fill="currentColor"/>
                  </svg>
                  GITHUB
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-6 pt-14 pb-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80"></div>
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl"></div>
        <div className="pointer-events-none absolute right-0 top-10 h-44 w-44 rounded-full bg-orange-200/30 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-2 pt-4 pb-0 md:px-6">
          <div className="grid gap-10 md:grid-cols-[1.25fr_1fr_1fr_1fr] md:gap-12">
            <div className="max-w-sm">
              <div className="logo-hover-wrap mb-4 flex items-center gap-3 text-slate-900">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Logo.svg`}
                  alt="Tectonic logo"
                  width={160}
                  height={44}
                  className="logo-hover-zoom h-9 w-auto object-contain"
                />
                <span className="text-xl font-black tracking-[0.22em]">TECTONIC</span>
              </div>
              <p className="max-w-xs text-sm leading-6 text-slate-600">
                {tFooter("desc")}
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">{tFooter("protocol")}</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li><a href="#" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">Docs</a></li>
                <li><a href="#" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">Contracts</a></li>
                <li><a href="https://github.com/StabilityNexus/Tectonic-EVM-WebUI" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">GitHub</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">{tFooter("community")}</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li><a href="https://discord.com/channels/995968619034984528/1503320626096635935" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">Discord</a></li>
                <li><a href="#" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">Twitter</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">{tFooter("resources")}</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li><a href="#" className="transition hover:text-amber-700 hover:underline hover:underline-offset-4">{tFooter("technicalPaper")}</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-24 border-t border-amber-200/80 pt-6">
            <p className="text-center text-sm text-slate-600">
              {tFooter("rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
