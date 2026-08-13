"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Search, 
  Filter, 
  Download,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2
} from "lucide-react";

const MOCK_LOGS = [
  { id: 1, type: "INFO", message: "System initialized successfully.", time: "10:05:22 AM", date: "Aug 12" },
  { id: 2, type: "SUCCESS", message: "Batch processing completed for Event #402. 120 certificates generated.", time: "10:12:45 AM", date: "Aug 12" },
  { id: 3, type: "ERROR", message: "SMTP connection failed. Timeout after 30000ms.", time: "10:15:02 AM", date: "Aug 12" },
  { id: 4, type: "INFO", message: "User Admin logged in from IP 192.168.1.1", time: "10:20:11 AM", date: "Aug 12" },
  { id: 5, type: "WARNING", message: "High memory usage detected in rendering worker.", time: "10:25:33 AM", date: "Aug 12" },
  { id: 6, type: "INFO", message: "CRON Job 'Daily_Backup' executed.", time: "11:00:00 AM", date: "Aug 12" },
  { id: 7, type: "SUCCESS", message: "Settings updated by User Admin.", time: "11:05:14 AM", date: "Aug 12" },
];

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = MOCK_LOGS.filter(l => l.message.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto pb-10 h-[calc(100vh-80px)]">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-20"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">System Logs</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Real-time audit trail and system events.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card/40 backdrop-blur-md border border-border/30 rounded-xl text-sm font-semibold hover:bg-muted/50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export Logs
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors shadow-sm">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </motion.header>

      {/* Main Terminal Window */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col"
      >
        {/* Terminal Header Bar */}
        <div className="bg-background/80 border-b border-border/20 p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-muted/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:border-foreground/30 focus:bg-background transition-all shadow-inner font-mono"
              />
            </div>
            <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground"><Filter className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm custom-scrollbar bg-[#0D1117] text-gray-300">
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 hover:bg-white/5 p-1 rounded transition-colors group"
              >
                <div className="text-gray-500 whitespace-nowrap shrink-0 mt-0.5">
                  <span className="mr-2">{log.date}</span>
                  <span>{log.time}</span>
                </div>
                
                <div className={`shrink-0 w-24 font-bold flex items-center gap-1.5 mt-0.5
                  ${log.type === 'INFO' ? 'text-blue-400' : ''}
                  ${log.type === 'SUCCESS' ? 'text-green-400' : ''}
                  ${log.type === 'WARNING' ? 'text-amber-400' : ''}
                  ${log.type === 'ERROR' ? 'text-red-400' : ''}
                `}>
                  {log.type === 'INFO' && <Info className="w-3.5 h-3.5" />}
                  {log.type === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {log.type === 'WARNING' && <AlertCircle className="w-3.5 h-3.5" />}
                  {log.type === 'ERROR' && <AlertCircle className="w-3.5 h-3.5" />}
                  [{log.type}]
                </div>
                
                <div className="text-gray-300 group-hover:text-white transition-colors break-words">
                  {log.message}
                </div>
              </motion.div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-gray-500 text-center mt-20">
                No logs matching "{searchQuery}"
              </div>
            )}
            
            {/* Blinking cursor effect */}
            <div className="flex items-center gap-2 mt-4 text-gray-500">
              <span>$</span>
              <div className="w-2 h-4 bg-gray-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
