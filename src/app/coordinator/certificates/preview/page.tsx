"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  Download, 
  Share2, 
  Printer,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function CertificatesPreviewPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-10 h-[85vh]">
      
      {/* Header Toolbar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center bg-card/40 backdrop-blur-3xl border border-border/30 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <Link href="/certificates" className="p-2 hover:bg-muted/80 rounded-xl transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold">Template Preview mode</h1>
            <p className="text-xs text-muted-foreground">Showing generic preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-muted/80 rounded-xl transition-colors text-muted-foreground hover:text-foreground hidden sm:block">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2.5 hover:bg-muted/80 rounded-xl transition-colors text-muted-foreground hover:text-foreground hidden sm:block">
            <Printer className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-md ml-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </motion.header>

      {/* Main Preview Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
        className="flex-1 bg-muted/20 border border-border/40 rounded-3xl overflow-hidden relative flex items-center justify-center p-8 lg:p-16 custom-scrollbar"
      >
        {/* Abstract background behind the certificate */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-purple-500/5 pointer-events-none" />
        
        {/* The Certificate Mock */}
        <div className="aspect-[1.414/1] w-full max-w-[1000px] bg-background shadow-2xl rounded-sm border border-border/20 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group">
          {/* Certificate Design Elements */}
          <div className="absolute top-0 left-0 w-full h-4 bg-accent" />
          <div className="absolute top-0 left-0 w-4 h-full bg-accent" />
          <div className="absolute bottom-0 right-0 w-full h-4 bg-accent" />
          <div className="absolute bottom-0 right-0 w-4 h-full bg-accent" />
          <div className="absolute inset-0 border-[16px] border-double border-border/10 pointer-events-none m-8" />
          
          <div className="absolute top-12 right-12 w-24 h-24 opacity-10">
             {/* Fake Seal */}
             <svg viewBox="0 0 100 100" className="w-full h-full fill-foreground">
               <polygon points="50,0 60,15 78,10 82,28 100,35 92,50 100,65 82,72 78,90 60,85 50,100 40,85 22,90 18,72 0,65 8,50 0,35 18,28 22,10 40,15"/>
             </svg>
          </div>

          <h3 className="text-4xl md:text-5xl font-serif text-foreground/80 mb-6 uppercase tracking-widest">Certificate</h3>
          <p className="text-sm md:text-lg text-muted-foreground uppercase tracking-widest mb-10">of Achievement</p>
          
          <p className="text-sm text-muted-foreground mb-4 italic">This is proudly presented to</p>
          <h4 className="text-5xl md:text-6xl font-bold text-foreground mb-8 font-serif border-b border-border/40 pb-4 px-12">
            [Participant Name]
          </h4>
          
          <p className="text-sm text-muted-foreground mb-2 italic">for successfully completing the</p>
          <p className="text-2xl font-semibold text-foreground/90 uppercase tracking-widest mb-16">[Event Name]</p>
          
          <div className="flex justify-between w-full max-w-xl mx-auto px-8 mt-auto border-t border-border/20 pt-4">
            <div className="text-center">
              <div className="font-signature text-2xl mb-1 text-foreground/80">Director Signature</div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Director</p>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg mb-1 text-foreground/80">[Date]</div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Date</p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
