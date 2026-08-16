"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(2px)" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex-1 h-full"
    >
      {children}
    </motion.div>
  );
}
