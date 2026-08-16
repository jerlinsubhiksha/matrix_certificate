"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCheck, 
  Upload, 
  Wand2, 
  Settings,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Mail
} from "lucide-react";

export default function CertificatesGeneratePage() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col gap-8 max-w-[900px] mx-auto pb-20">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center pb-8 border-b border-border/20"
      >
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mx-auto mb-6 shadow-inner border border-accent/10">
          <Wand2 className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Generate Certificates</h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium">Create and distribute certificates in three simple steps.</p>
      </motion.header>

      {/* Progress Steps */}
      <div className="flex justify-between items-center relative mb-8 px-4">
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-muted/50 rounded-full -z-10 overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        {[
          { num: 1, label: "Select Event" },
          { num: 2, label: "Design Template" },
          { num: 3, label: "Review & Send" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 shadow-sm
              ${step >= s.num ? 'bg-accent text-background' : 'bg-card border-2 border-border/40 text-muted-foreground'}`}
            >
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span className={`text-xs font-semibold ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main Wizard Area */}
      <div className="bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Select an Event</h2>
                <p className="text-muted-foreground text-sm">Choose the event you want to generate certificates for.</p>
              </div>
              
              <div className="grid gap-4">
                {["Global Tech Summit 2026", "UI/UX Masterclass", "Next.js Performance Tuning"].map((evt, i) => (
                  <label key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-background/30 hover:bg-muted/50 hover:border-accent/40 cursor-pointer transition-all group">
                    <input type="radio" name="event" className="w-5 h-5 accent-accent" defaultChecked={i===0} />
                    <div>
                      <span className="font-semibold block text-foreground group-hover:text-accent transition-colors">{evt}</span>
                      <span className="text-xs text-muted-foreground">August {10 + i}, 2026 • {120 + i*15} Verified Participants</span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Design & Template</h2>
                <p className="text-muted-foreground text-sm">Upload or select a template mapping for your certificates.</p>
              </div>
              
              <div className="border-2 border-dashed border-border/60 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-background/20 hover:bg-background/40 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Upload Template (PDF/SVG)</h3>
                <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
              </div>
              
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Using Default Variables: <span className="font-mono text-xs bg-background/50 px-2 py-1 rounded">{{Name}}</span>, <span className="font-mono text-xs bg-background/50 px-2 py-1 rounded">{{Course}}</span></span>
                </div>
                <button className="text-xs font-bold text-accent hover:underline">Edit Mapping</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Ready to Generate!</h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8">
                You are about to generate <strong>120</strong> certificates for <strong>Global Tech Summit 2026</strong>. This process will take approximately 2 minutes.
              </p>
              
              <div className="bg-background/40 border border-border/40 rounded-2xl p-6 max-w-md mx-auto text-left mb-8 shadow-inner">
                <h4 className="font-semibold text-sm mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-accent"/> Email Settings</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subject:</span> <span className="font-medium">Your Certificate is ready!</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Send automatically:</span> <span className="font-medium text-green-500">Yes</span></div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-border/20 bg-card/80 backdrop-blur-xl flex justify-between">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-muted text-foreground'}`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : alert("Generating certificates...")}
            className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-md"
          >
            {step === 3 ? 'Generate Now' : 'Continue'} {step !== 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
}
