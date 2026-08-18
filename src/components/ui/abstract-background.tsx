"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, FileCheck } from "lucide-react";

export const AbstractBackground = () => {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Cyberpunk Smoke Layers */}
      <div className="absolute w-[70vw] h-[70vw] rounded-full blur-[120px] bg-blue-500/30 dark:bg-pink-600/30 animate-smoke-1 opacity-70 dark:opacity-80" style={{ top: '-10%', left: '-10%' }} />
      <div className="absolute w-[80vw] h-[80vw] rounded-full blur-[150px] bg-cyan-400/20 dark:bg-purple-600/30 animate-smoke-2 opacity-60 dark:opacity-70" style={{ top: '20%', right: '-20%' }} />
      <div className="absolute w-[90vw] h-[90vw] rounded-full blur-[130px] bg-blue-600/20 dark:bg-rose-500/30 animate-smoke-3 opacity-70 dark:opacity-80" style={{ bottom: '-30%', left: '10%' }} />
      <div className="absolute w-[60vw] h-[60vw] rounded-full blur-[100px] bg-indigo-500/20 dark:bg-fuchsia-500/30 animate-smoke-1 opacity-50 dark:opacity-60" style={{ top: '40%', left: '30%', animationDirection: 'reverse' }} />
    </div>
  );
};
