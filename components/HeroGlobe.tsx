"use client";

import { useEffect, useRef } from "react";
import { decodeDots, HUBS } from "@/lib/world-land";

/* --- TYPES --- */

interface HeroGlobeProps {
  /** Applied to the wrapping element. The canvas fills it and stays square. */
  className?: string;
  /** Degrees of rotation per second. */
  speed?: number;
  /** Longitude at the centre of the globe when the animation starts. */
  startLongitude?: number;
}

/* --- GEOMETRY --- */

const DEG = Math.PI / 180;
const VIEW_LATITUDE = 22; // tilt: how far above the equator the camera sits
const DEPTH_BANDS = 4; // dots are batched into this many depth buckets per frame

/** [lon, lat] in degrees to a unit vector with z through the north pole. */
function toVector(lon: number, lat: number): [number, number, number] {
  const p = lat * DEG;
  const l = lon * DEG;
  const c = Math.cos(p);
  return [c * Math.cos(l), c * Math.sin(l), Math.sin(p)];
}

/** Flatten [lon, lat] pairs to [x0, y0, z0, x1, y1, z1, ...]. */
function toBuffer(points: Array<[number, number]>): Float32Array {
  const out = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    const [x, y, z] = toVector(points[i][0], points[i][1]);
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/* --- COMPONENT --- */

export default function HeroGlobe({
  className = "",
  speed = 2,
  startLongitude = -32,
}: HeroGlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const land = toBuffer(decodeDots());
    const hubs = HUBS.map(([lon, lat]) => toVector(lon, lat));

    const S0 = Math.sin(VIEW_LATITUDE * DEG);
    const C0 = Math.cos(VIEW_LATITUDE * DEG);

    let size = 0;
    let frame = 0;
    let running = false;
    let last = 0;
    let spin = -startLongitude * DEG;

    function render() {
      if (!size) return;
      const mid = size / 2;
      const r = mid - 2;
      const sa = Math.sin(spin);
      const ca = Math.cos(spin);

      ctx!.clearRect(0, 0, size, size);

      /* Spin about the polar axis, tilt to the viewing latitude, drop the depth
         component. Dots are collected into depth bands so each band is one fill
         instead of one fill per dot. */
      const bands: Array<Array<number>> = [];
      for (let b = 0; b < DEPTH_BANDS; b++) bands.push([]);

      for (let i = 0; i < land.length; i += 3) {
        const vx = land[i];
        const vy = land[i + 1];
        const vz = land[i + 2];
        const rx = vx * ca - vy * sa;
        const depth = rx * C0 + vz * S0;
        if (depth <= 0.02) continue;
        const band = Math.min(DEPTH_BANDS - 1, Math.floor(depth * DEPTH_BANDS));
        bands[band].push(
          mid + r * (vx * sa + vy * ca),
          mid - r * (vz * C0 - rx * S0),
        );
      }

      for (let b = 0; b < DEPTH_BANDS; b++) {
        const pts = bands[b];
        if (!pts.length) continue;
        const t = (b + 0.5) / DEPTH_BANDS;
        const dot = r * (0.0055 + 0.0055 * t);
        ctx!.beginPath();
        for (let i = 0; i < pts.length; i += 2) {
          ctx!.moveTo(pts[i] + dot, pts[i + 1]);
          ctx!.arc(pts[i], pts[i + 1], dot, 0, Math.PI * 2);
        }
        ctx!.fillStyle = `rgba(138,79,34,${(0.2 + 0.55 * t).toFixed(3)})`;
        ctx!.fill();
      }

      // hub network: project the visible hubs, then link the near pairs
      const shown: Array<[number, number]> = [];
      for (const [vx, vy, vz] of hubs) {
        const rx = vx * ca - vy * sa;
        if (rx * C0 + vz * S0 <= 0.08) continue;
        shown.push([mid + r * (vx * sa + vy * ca), mid - r * (vz * C0 - rx * S0)]);
      }

      ctx!.lineCap = "round";
      ctx!.beginPath();
      for (let i = 0; i < shown.length; i++) {
        for (let j = i + 1; j < shown.length; j++) {
          if (Math.hypot(shown[i][0] - shown[j][0], shown[i][1] - shown[j][1]) < r) {
            ctx!.moveTo(shown[i][0], shown[i][1]);
            ctx!.lineTo(shown[j][0], shown[j][1]);
          }
        }
      }
      ctx!.lineWidth = Math.max(r / 260, 0.5);
      ctx!.strokeStyle = "rgba(194,65,12,0.3)";
      ctx!.stroke();

      ctx!.beginPath();
      for (const [x, y] of shown) {
        ctx!.moveTo(x + r * 0.012, y);
        ctx!.arc(x, y, r * 0.012, 0, Math.PI * 2);
      }
      ctx!.fillStyle = "rgba(180,83,9,0.85)";
      ctx!.fill();

      // the silhouette - the curve the old asset never closed
      ctx!.beginPath();
      ctx!.arc(mid, mid, r, 0, Math.PI * 2);
      ctx!.lineWidth = Math.max(r / 200, 0.6);
      ctx!.strokeStyle = "rgba(138,79,34,0.28)";
      ctx!.stroke();
    }

    function tick(now: number) {
      if (!running) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      spin -= speed * DEG * dt;
      render();
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function resize() {
      const next = Math.round(wrap!.clientWidth);
      if (!next) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = next;
      canvas!.width = Math.round(next * dpr);
      canvas!.height = Math.round(next * dpr);
      canvas!.style.width = `${next}px`;
      canvas!.style.height = `${next}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Only animate while the globe is actually on screen and motion is welcome.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !motion.matches) start();
        else stop();
      },
      { threshold: 0 },
    );

    function onMotionChange() {
      if (motion.matches) {
        stop();
        render();
      } else {
        start();
      }
    }

    const ro = new ResizeObserver(resize);
    resize();
    ro.observe(wrap);
    io.observe(wrap);
    motion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      motion.removeEventListener("change", onMotionChange);
    };
  }, [speed, startLongitude]);

  return (
    <div ref={wrapRef} className={`relative aspect-square w-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label="A slowly rotating globe, its landmasses drawn as a field of dots, with a network of connected hubs"
      />
    </div>
  );
}
