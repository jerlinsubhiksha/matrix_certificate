"use client";

import React, { useState } from "react";
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
  depth = 15,
  maxRotate = 6 
}: Card3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${maxRotate}deg`, `-${maxRotate}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${maxRotate}deg`, `${maxRotate}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: isHovered ? "preserve-3d" : "flat",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      className={`transition-shadow duration-300 ${isHovered ? 'perspective-[1000px]' : ''} ${className}`}
    >
      <div 
        style={{ 
          transform: isHovered ? `translateZ(${depth}px)` : "none", 
          transformStyle: isHovered ? "preserve-3d" : "flat",
          backfaceVisibility: "hidden" 
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
