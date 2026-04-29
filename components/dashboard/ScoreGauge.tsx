"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function ScoreGauge({
  score,
  verdict,
  size = 280,
}: {
  score: number;
  verdict: string;
  size?: number;
}) {
  const radius = (size - 30) / 2;
  const circumference = 2 * Math.PI * radius;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest * 10) / 10);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [score, count, rounded]);

  // Color based on score band
  const color =
    score >= 80 ? "#00ffc6" :
    score >= 65 ? "#00e0b7" :
    score >= 50 ? "#ffb347" :
                  "#ff5b6b";

  const dashOffset = circumference - (display / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Outer tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 2 * Math.PI;
          const innerR = radius + 6;
          const outerR = radius + 12;
          const x1 = size / 2 + Math.cos(angle) * innerR;
          const y1 = size / 2 + Math.sin(angle) * innerR;
          const x2 = size / 2 + Math.cos(angle) * outerR;
          const y2 = size / 2 + Math.sin(angle) * outerR;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 5 === 0 ? "#5a6885" : "#242d48"}
              strokeWidth={i % 5 === 0 ? 1.5 : 1}
            />
          );
        })}

        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a2238"
          strokeWidth={10}
          fill="none"
        />

        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 12px ${color}90)`,
          }}
        />

        {/* Inner decorative circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 16}
          stroke="#131a2c"
          strokeWidth={1}
          fill="none"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="tag-label mb-3">MATCH INDEX</p>
        <div className="flex items-baseline font-display">
          <span
            className="text-6xl tabular-nums transition-colors"
            style={{ color }}
          >
            {display.toFixed(1)}
          </span>
          <span className="ml-1 text-xl text-abyss-500">/100</span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color }}
        >
          ◆ {verdict}
        </motion.p>
      </div>
    </div>
  );
}
