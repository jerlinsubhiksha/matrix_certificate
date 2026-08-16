"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  FileCheck,
  Calendar,
  MailCheck,
  MailWarning,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CoordinatorActivityPage() {
  return (
    <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-20">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-2 pb-4"
      >
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">
          Pipeline Activity
        </h1>
        <p className="text-base text-muted-foreground font-medium">Detailed insights into your certification events and participant engagement.</p>
      </motion.header>

      {/* Top Stats Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard title="Total Certificates" value="0" icon={FileCheck} trend="0%" positive />
        <StatCard title="Total Participants" value="0" icon={Users} trend="0%" positive />
        <StatCard title="Active Events" value="0" icon={Calendar} trend="0%" positive={false} />
        <StatCard title="Email Delivery Rate" value="0%" icon={MailCheck} trend="0%" positive />
      </motion.div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Certificates Issued</h3>
              <p className="text-sm text-muted-foreground mt-1">Monthly trend of generated certificates.</p>
            </div>
            <select className="bg-background/50 border border-border/40 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-accent">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Mock Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 relative z-10">
            {/* Chart Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              {[0,1,2,3].map(i => <div key={i} className="w-full h-px bg-foreground" />)}
            </div>
            
            {/* Bars */}
            {[0, 0, 0, 0, 0, 0].map((height, i) => (
              <div key={i} className="w-full relative group h-full flex items-end justify-center">
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-4/5 bg-accent/80 rounded-t-lg relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    0
                  </div>
                </motion.div>
                <div className="absolute -bottom-6 text-xs text-muted-foreground font-medium">
                  {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i]}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col"
        >
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xl font-bold tracking-tight mb-1 relative z-10">Email Status</h3>
          <p className="text-sm text-muted-foreground mb-8 relative z-10">Delivery success rates.</p>
          
          <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
            {/* Mock Donut Chart using SVG */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-muted/30" strokeWidth="12" fill="none" />
                <motion.circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-accent" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="251.2" 
                  initial={{ strokeDashoffset: 251.2 }}
                  whileInView={{ strokeDashoffset: 251.2 }} // 0% full
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-extrabold tracking-tight">0%</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Delivered</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="font-medium">Delivered</span>
                </div>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                  <span className="font-medium">Bounced</span>
                </div>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

// Helper Component for Stat Cards
function StatCard({ title, value, icon: Icon, trend, positive }: any) {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl p-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all group"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-foreground/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center border border-border/40 shadow-inner">
          <Icon className="w-5 h-5 text-foreground/70" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-md ${positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      
      <div className="space-y-1">
        <h4 className="text-muted-foreground text-sm font-medium">{title}</h4>
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
}
