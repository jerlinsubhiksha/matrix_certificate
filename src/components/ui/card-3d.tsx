"use client";

import React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  maxRotate?: number;
}

export function Card3D({ 
  children, 
  className = "", 
  depth = 25,
  maxRotate = 8 
}: Card3DProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${maxRotate}deg`, `-${maxRotate}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${maxRotate}deg`, `${maxRotate}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`perspective-[1000px] transition-shadow duration-300 ${className}`}
    >
      <div style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
