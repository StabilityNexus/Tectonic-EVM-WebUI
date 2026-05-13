"use client";

import Image from 'next/image';
import { useEffect } from 'react';

const tectonicLetters = 'TECTONIC'.split('');

export default function Home() {
  useEffect(() => {
    const container = document.querySelector('.animated-word.hero-word-inline');
    if (!container) return;
    const letters = container.querySelectorAll('.hero-letter');
    if (!letters.length) return;
    const last = letters[letters.length - 1];
    const onEnd = () => {
      letters.forEach((l) => l.classList.add('loop'));
      last.removeEventListener('animationend', onEnd);
    };
    last.addEventListener('animationend', onEnd);
    return () => last.removeEventListener('animationend', onEnd);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden pt-0">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glassy-navbar">
        <div className="px-6 py-3 flex items-center justify-between w-full">
          <div className="text-2xl font-bold tracking-wider flex items-center gap-2">
            <span className="text-yellow-500">◊</span>
            <span className="animated-word" aria-label="TECTONIC">
              {tectonicLetters.map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="navbar-letter"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <a href="#learn" className="text-gray-700 hover:text-yellow-500 transition">LEARN</a>
            <a href="#build" className="text-gray-700 hover:text-yellow-500 transition">BUILD</a>
            <a href="#explore" className="text-gray-700 hover:text-yellow-500 transition">EXPLORE</a>
          </div>
          <button className="btn-primary text-sm">START BUILDING</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-orbital overflow-visible pt-24 pb-16">
        {/* Enhanced Orbital Background with Animated Glows */}
        <div className="orbital-container">
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-2"></div>
          <div className="glow-orb glow-orb-3"></div>
          
          <div className="glow-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>

        <div className="z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-left">
            <div className="mb-8 inline-block">
              <span className="hero-kicker text-sm font-semibold text-yellow-500">Next Generation Stablecoin Protocol</span>
            </div>

            <h1 className="hero-title mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-7xl">
              <span className="hero-title-line hero-title-line-first">Activate the EVM economy</span>
              <span className="hero-title-line hero-title-line-second hero-title-accent">
                With{' '}
                <span className="animated-word hero-word-inline" aria-label="TECTONIC">
                  {tectonicLetters.map((letter, index) => (
                    <span
                      key={`hero-${letter}-${index}`}
                      className="hero-letter"
                      style={{ animationDelay: `${index * 0.35}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p className="mb-12 max-w-2xl text-lg text-gray-600 md:text-xl">
              A revolutionary stablecoin protocol enabling forced redemptions and enhanced stability.
              Use and build apps that leverage EVM as a secure base layer.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
              <button className="btn-primary text-lg">START BUILDING →</button>
              <button className="btn-secondary text-lg">LEARN MORE</button>
            </div>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-sm md:mt-0 md:absolute hero-visual md:w-[min(85vw,950px)] hero-visual-lg lg:w-[min(90vw,1200px)] lg:max-w-none">
            <div className="relative aspect-[4/3] w-full drop-shadow-2xl md:aspect-[5/4]">
              <Image
                src="/tectonic-hero.png"
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

      {/* Features Section */}
      <section id="learn" className="py-20 px-6 max-w-7xl mx-auto bg-white">
        <div className="mb-16">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">Why Tectonic?</h2>
          <p className="text-gray-700 text-lg">More flexibility, more composability, more security. Major upgrades across the entire Tectonic ecosystem.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 border border-yellow-200 rounded-lg p-8 hover:border-yellow-400 transition">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Forced Redemptions</h3>
            <p className="text-gray-700">Unique mechanism ensuring protocol stability through automatic redemptions at predetermined rates.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 border border-yellow-200 rounded-lg p-8 hover:border-yellow-400 transition">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure Base Layer</h3>
            <p className="text-gray-700">Built on EVM with battle-tested security. Leverage blockchain&apos;s immutable infrastructure.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 border border-yellow-200 rounded-lg p-8 hover:border-yellow-400 transition">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">EVM Compatible</h3>
            <p className="text-gray-700">Deploy on any EVM-compatible chain. Maximum interoperability and reach.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-50 border border-yellow-200 rounded-lg p-8 hover:border-yellow-400 transition">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💱</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">DeFi Integration</h3>
            <p className="text-gray-700">Seamlessly integrate with existing DeFi protocols. Composable by design.</p>
          </div>
        </div>
      </section>

      {/* Protocol Overview */}
      <section id="build" className="py-20 px-6 max-w-7xl mx-auto bg-white">
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-gray-700 mb-8 text-lg">
            Tectonic introduces forced redemptions as a core mechanism, significantly different from traditional stablecoin protocols like Djed. 
            This approach provides enhanced stability guarantees while maintaining composability with the broader EVM ecosystem.
          </p>
          <button className="btn-primary">READ WHITEPAPER</button>
        </div>
      </section>

      {/* Latest News */}
      <section id="explore" className="py-20 px-6 max-w-7xl mx-auto bg-white">
        <h2 className="text-4xl font-bold mb-12 text-gray-900">Latest Updates</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <article className="border border-yellow-200 rounded-lg overflow-hidden hover:border-yellow-400 transition group">
            <div className="h-40 bg-gradient-to-br from-yellow-200 to-transparent"></div>
            <div className="p-6">
              <p className="text-sm text-yellow-600 font-semibold mb-2">SOLIDITY CONTRACTS</p>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Tectonic Core Implementation</h3>
              <p className="text-gray-700 mb-4">Smart contracts for the Tectonic protocol now in active development.</p>
              <span className="text-sm text-gray-600">May 2026</span>
            </div>
          </article>

          <article className="border border-yellow-200 rounded-lg overflow-hidden hover:border-yellow-400 transition group">
            <div className="h-40 bg-gradient-to-br from-yellow-200 to-transparent"></div>
            <div className="p-6">
              <p className="text-sm text-yellow-600 font-semibold mb-2">PLATFORM</p>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Frontend Platform Launch</h3>
              <p className="text-gray-700 mb-4">Modern web interface for interacting with Tectonic protocol.</p>
              <span className="text-sm text-gray-600">May 2026</span>
            </div>
          </article>

          <article className="border border-yellow-200 rounded-lg overflow-hidden hover:border-yellow-400 transition group">
            <div className="h-40 bg-gradient-to-br from-yellow-200 to-transparent"></div>
            <div className="p-6">
              <p className="text-sm text-yellow-600 font-semibold mb-2">INTEGRATION</p>
              <h3 className="text-xl font-bold mb-2 text-gray-900">StablePay Integration</h3>
              <p className="text-gray-700 mb-4">Tectonic integration for StablePay payment protocol.</p>
              <span className="text-sm text-gray-600">May 2026</span>
            </div>
          </article>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-6 bg-gray-50 border-t border-yellow-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Join the Community</h2>
          <p className="text-gray-700 text-lg mb-12">
            Be part of the next generation of stablecoin infrastructure. 
            Connect with builders, researchers, and enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">DISCORD</button>
            <button className="btn-primary">TWITTER</button>
            <button className="btn-primary">GITHUB</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-yellow-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-xl font-bold mb-4">
                <span className="text-yellow-500">◊</span> TECTONIC
              </div>
              <p className="text-gray-600 text-sm">Next-generation stablecoin protocol.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Protocol</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="#" className="hover:text-yellow-500 transition">Docs</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Contracts</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Community</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="#" className="hover:text-yellow-500 transition">Discord</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Forum</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="#" className="hover:text-yellow-500 transition">Whitepaper</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-yellow-200 pt-8">
            <p className="text-sm text-gray-700 text-center">
              © 2026 Tectonic Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
