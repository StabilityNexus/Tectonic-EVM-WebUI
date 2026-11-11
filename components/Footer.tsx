
"use client";

import Image from "next/image";
import { useTranslations } from "@/lib/i18n";

interface FooterProps {
  maxWidth?: "5xl" | "7xl";
}

export default function Footer({ maxWidth = "7xl" }: FooterProps) {
  const tFooter = useTranslations("footer");

  const columns = [
    {
      title: tFooter("protocol"),
      links: [
        { label: "Docs", href: "#" },
        { label: "Contracts", href: "#" },
        {
          label: "GitHub",
          href: "https://github.com/StabilityNexus/Tectonic-EVM-WebUI",
        },
      ],
    },
    {
      title: tFooter("community"),
      links: [
        { label: "Discord", href: "https://discord.gg/YzDKeEfWtS" },
        { label: "Telegram", href: "https://t.me/StabilityNexus" },
      ],
    },
    {
      title: tFooter("resources"),
      links: [
        { label: tFooter("technicalPaper"), href: "#" },
        { label: "KYA / Terms", href: "#" },
      ],
    },
  ];

  const containerWidth =
    maxWidth === "5xl" ? "max-w-5xl" : "max-w-7xl";

  return (
    <footer className="relative overflow-hidden border-t border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pt-8 pb-4 sm:px-6 sm:pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />

      <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-10 h-44 w-44 rounded-full bg-orange-200/30 blur-3xl" />

      <div
        className={`relative mx-auto ${containerWidth} px-2 md:px-6`}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 sm:gap-10 md:gap-12">

          {/* Brand */}
          <div className="col-span-2 flex flex-col items-center text-center sm:col-span-1">
            <div className="logo-hover-wrap mb-3 flex flex-col items-center gap-2 text-slate-900">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Logo.svg`}
                alt="Tectonic logo"
                width={72}
                height={72}
                className="logo-hover-zoom h-14 w-auto object-contain sm:h-16"
              />

              <span className="bg-gradient-to-b from-[#c38b44] to-[#7e4420] bg-clip-text text-2xl font-black leading-none tracking-[0.04em] text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                TECTONIC
              </span>
            </div>

            <p className="max-w-xs text-sm leading-6 text-slate-600">
              {tFooter("desc")}
            </p>
          </div>

          {/* Footer link groups */}
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 sm:mb-4 sm:text-sm sm:tracking-[0.22em]">
                {column.title}
              </h4>

              <ul className="space-y-2.5 text-sm text-slate-700">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={
                        link.href.startsWith("http")
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="transition hover:text-amber-700 hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Stability Nexus branding */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-amber-200/80 pt-5 sm:mt-10 md:flex-row md:gap-4 md:pt-6">
          <p className="text-center text-xs leading-5 text-slate-600 sm:text-sm md:text-left">
            {tFooter("rights")}
          </p>

          <a
            href="https://stability.nexus/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Stability Nexus"
            className="inline-block transition-opacity hover:opacity-90"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo-animated.gif`}
              alt="Stability Nexus Badge"
              width={180}
              height={50}
              className="h-10 w-auto rounded-lg sm:h-12"
              unoptimized
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
