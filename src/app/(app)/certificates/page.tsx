"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileCheck, 
  CheckCircle2, 
  ChevronRight, 
  Image as ImageIcon, 
  Users, 
  Send,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Settings,
  Type,
  Palette,
  Move,
  Loader2,
  Check
} from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import html2canvas from "html2canvas";

const FONT_OPTIONS = [
  { label: 'Playfair Display (Elegant)', value: "'Playfair Display', serif" },
  { label: 'Cinzel (Classic)', value: "'Cinzel', serif" },
  { label: 'Great Vibes (Cursive)', value: "'Great Vibes', cursive" },
  { label: 'Montserrat (Modern)', value: "'Montserrat', sans-serif" },
  { label: 'Roboto (Clean)', value: "'Roboto', sans-serif" },
];

export default function CertificatesPipelinePage() {
  const { events, addEmailJob, incrementCertificates, incrementEmails } = useStore();
  const [step, setStep] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState("");
  
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Live Tracking state
  const [liveJobs, setLiveJobs] = useState<{ id: string, name: string, email: string, status: string }[]>([]);
  const [currentRenderParticipant, setCurrentRenderParticipant] = useState<any | null>(null);

  // Template Design State
  const [design, setDesign] = useState({
    nameFont: "'Playfair Display', serif",
    nameColor: '#1e293b',
    nameSize: 48,
    descFont: "'Montserrat', sans-serif",
    descText: 'For successfully completing the program.',
    descColor: '#334155',
    descSize: 20,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const templateInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  useEffect(() => {
    if (selectedEvent) {
      setDesign(prev => ({ ...prev, descText: `For successfully completing the ${selectedEvent.name} program.` }));
    }
  }, [selectedEventId, selectedEvent]);

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTemplateImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
      if (lines.length < 2) return; 

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      
      const parsed = lines.slice(1).map((line, index) => {
        const values = line.split(",").map(v => v.trim());
        const participant: any = { id: `P-${index}` };
        headers.forEach((header, index) => {
          if (header === 'name' || header === 'full name') participant.name = values[index];
          if (header === 'email' || header === 'email address') participant.email = values[index];
        });
        return participant;
      }).filter(p => p.name && p.email);

      setParticipants(parsed);
    };
    reader.readAsText(file);
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const deleteParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleGenerateAndSend = async () => {
    setStep(3);
    setIsGenerating(true);
    setProgress(0);

    const tracking = participants.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      status: 'Pending'
    }));
    setLiveJobs(tracking);

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      
      // 1. Setup DOM for this specific participant
      setCurrentRenderParticipant(p);
      setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Generating' } : j));
      
      // Wait for React to render the new name in the DOM
      await new Promise(r => setTimeout(r, 200));
      
      const node = document.getElementById('certificate-render-node');
      if (node) {
        // 2. Snapshot the DOM node to an actual image
        const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: null });
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // 3. Simulate email dispatch
        setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Sending' } : j));
        await new Promise(r => setTimeout(r, 800)); // Network delay simulation
        
        // 4. Save to global email queue
        addEmailJob({
          eventId: selectedEventId,
          participantName: p.name,
          participantEmail: p.email,
          status: 'Completed',
          timestamp: new Date().toISOString()
        });

        setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Completed' } : j));
      }
      
      setProgress(Math.round(((i + 1) / participants.length) * 100));
    }
    
    incrementCertificates(participants.length);
    incrementEmails(participants.length);
    setIsGenerating(false);
    setCurrentRenderParticipant(null); // Reset back to preview mode
  };

  if (!mounted) return null;

  const displayParticipant = currentRenderParticipant || participants[0] || { name: "John Doe" };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-10">
      <header className="flex flex-col border-b border-border/20 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Certificate Generator</h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium">Upload a template, refine your data, design the layout, and dispatch.</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-8 shadow-sm space-y-6">
              
              <div>
                <label className="block text-sm font-semibold mb-2">1. Select Event</label>
                {events.length === 0 ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">You need to create an event first. <Link href="/events" className="underline">Go to Events</Link></p>
                  </div>
                ) : (
                  <select 
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border/60 rounded-xl focus:border-accent focus:outline-none transition-colors"
                  >
                    <option value="" disabled>Choose an event...</option>
                    {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">2. Upload Template</label>
                  <div 
                    onClick={() => templateInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                      templateImage ? 'border-accent/50 bg-accent/5' : 'border-border/60 hover:bg-muted/30 hover:border-foreground/30'
                    }`}
                  >
                    <input type="file" ref={templateInputRef} onChange={handleTemplateUpload} className="hidden" />
                    {templateImage ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-accent mb-3" />
                        <p className="font-semibold text-foreground">Template Uploaded</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-muted-foreground mb-3" />
                        <p className="font-semibold text-foreground">Upload Template Image</p>
                        <p className="text-xs text-muted-foreground mt-1">Any file format supported</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">3. Import Participants</label>
                  <div 
                    onClick={() => csvInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                      participants.length > 0 ? 'border-blue-500/50 bg-blue-500/5' : 'border-border/60 hover:bg-muted/30 hover:border-foreground/30'
                    }`}
                  >
                    <input type="file" accept=".csv" ref={csvInputRef} onChange={handleCsvUpload} className="hidden" />
                    {participants.length > 0 ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-blue-500 mb-3" />
                        <p className="font-semibold text-foreground">{participants.length} Participants Loaded</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to replace CSV</p>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-8 h-8 text-muted-foreground mb-3" />
                        <p className="font-semibold text-foreground">Upload Participants CSV</p>
                        <p className="text-xs text-muted-foreground mt-1">Must contain 'name' and 'email' columns</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Participants Table */}
              {participants.length > 0 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold">4. Review & Edit Data</label>
                    <span className="text-xs text-muted-foreground font-medium">Click on any field to edit directly.</span>
                  </div>
                  <div className="bg-background border border-border/50 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email Address</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {participants.map((p, i) => (
                          <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-2">
                              <input 
                                type="text" 
                                value={p.name} 
                                onChange={(e) => updateParticipant(i, 'name', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-1 focus:ring-accent/50 rounded px-2 py-1 outline-none font-medium"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input 
                                type="email" 
                                value={p.email} 
                                onChange={(e) => updateParticipant(i, 'email', e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-1 focus:ring-accent/50 rounded px-2 py-1 outline-none text-muted-foreground"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button onClick={() => deleteParticipant(i)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-end">
              <button 
                disabled={!selectedEventId || !templateImage || participants.length === 0}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg"
              >
                Continue to Template Designer <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div 
            key="step2and3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col xl:flex-row gap-8"
          >
            {/* The Certificate Canvas (Always present during step 2 and 3 so HTML2Canvas can snapshot it) */}
            <div className="flex-1 flex flex-col bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">{step === 2 ? "Template Designer" : "Live Rendering Engine"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step === 2 ? "Drag the text blocks to position them on your template." : "Baking names directly into the template images..."}
                  </p>
                </div>
                {step === 2 && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                    <Move className="w-3.5 h-3.5" /> Draggable Elements
                  </div>
                )}
              </div>
              
              <div className="relative w-full aspect-[1.414/1] bg-muted rounded-xl border-2 border-dashed border-border overflow-hidden shadow-inner flex items-center justify-center">
                
                {/* RENDER NODE - This exact div is snapshotted by HTML2Canvas */}
                <div id="certificate-render-node" className="absolute inset-0 w-full h-full bg-white overflow-hidden">
                  {/* Template Image / PDF */}
                  {templateImage && (
                    templateImage.startsWith("data:application/pdf") ? (
                      <object data={templateImage} type="application/pdf" className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" aria-label="Template PDF">
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-card">PDF Template Loaded</div>
                      </object>
                    ) : (
                      <img src={templateImage} alt="Template" className="absolute inset-0 w-full h-full object-cover pointer-events-none" crossOrigin="anonymous" />
                    )
                  )}
                  
                  {/* Draggable Overlays */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    
                    {/* Name Overlay */}
                    <motion.div 
                      drag={step === 2}
                      dragMomentum={false}
                      className={`absolute pointer-events-auto p-2 border rounded-lg transition-colors group
                        ${step === 2 ? 'cursor-move border-transparent hover:border-accent/50 hover:bg-accent/5' : 'border-transparent'}
                      `}
                      style={{ top: '35%', left: '50%', x: '-50%', y: '-50%' }}
                    >
                      <h2 
                        className="whitespace-nowrap leading-none" 
                        style={{ fontFamily: design.nameFont, color: design.nameColor, fontSize: `${design.nameSize}px` }}
                      >
                        {displayParticipant.name}
                      </h2>
                      {step === 2 && <div className="absolute -top-3 -right-3 bg-accent text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Name</div>}
                    </motion.div>

                    {/* Description Overlay */}
                    <motion.div 
                      drag={step === 2}
                      dragMomentum={false}
                      className={`absolute pointer-events-auto p-2 border rounded-lg transition-colors group text-center
                        ${step === 2 ? 'cursor-move border-transparent hover:border-accent/50 hover:bg-accent/5' : 'border-transparent'}
                      `}
                      style={{ top: '60%', left: '50%', x: '-50%', y: '-50%' }}
                    >
                      <p 
                        className="whitespace-pre-wrap max-w-lg leading-tight" 
                        style={{ fontFamily: design.descFont, color: design.descColor, fontSize: `${design.descSize}px` }}
                      >
                        {design.descText}
                      </p>
                      {step === 2 && <div className="absolute -top-3 -right-3 bg-accent text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Description</div>}
                    </motion.div>

                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar Changes Based on Step */}
            <div className="w-full xl:w-[360px] flex flex-col gap-6">
              
              {step === 2 ? (
                /* Step 2: Editor Tools */
                <>
                  <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-sm flex-1">
                    <h4 className="font-bold mb-6 flex items-center gap-2 border-b border-border/40 pb-3"><Settings className="w-4 h-4 text-accent" /> Editor Tools</h4>
                    
                    {/* Description Text Input */}
                    <div className="space-y-4 mb-6">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Description Text</label>
                      <textarea 
                        value={design.descText}
                        onChange={(e) => setDesign({...design, descText: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-xl focus:border-accent focus:outline-none transition-colors text-sm resize-none"
                      />
                    </div>

                    {/* Typography Settings */}
                    <div className="space-y-5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Typography</label>
                      
                      {/* Name Settings */}
                      <div className="bg-muted/20 p-3 rounded-xl border border-border/30 space-y-3">
                        <span className="text-xs font-semibold block">Participant Name</span>
                        <select 
                          value={design.nameFont}
                          onChange={(e) => setDesign({...design, nameFont: e.target.value})}
                          className="w-full text-xs px-2 py-1.5 bg-background border border-border/60 rounded focus:border-accent focus:outline-none"
                        >
                          {FONT_OPTIONS.map(f => <option key={f.label} value={f.value}>{f.label}</option>)}
                        </select>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            value={design.nameColor}
                            onChange={(e) => setDesign({...design, nameColor: e.target.value})}
                            className="w-8 h-8 rounded cursor-pointer shrink-0 border-none bg-transparent" 
                          />
                          <div className="flex-1 flex items-center gap-2">
                            <input 
                              type="range" min="20" max="120" 
                              value={design.nameSize}
                              onChange={(e) => setDesign({...design, nameSize: parseInt(e.target.value)})}
                              className="w-full accent-primary" 
                            />
                            <span className="text-xs font-medium w-8 text-right">{design.nameSize}px</span>
                          </div>
                        </div>
                      </div>

                      {/* Description Settings */}
                      <div className="bg-muted/20 p-3 rounded-xl border border-border/30 space-y-3">
                        <span className="text-xs font-semibold block">Description Text</span>
                        <select 
                          value={design.descFont}
                          onChange={(e) => setDesign({...design, descFont: e.target.value})}
                          className="w-full text-xs px-2 py-1.5 bg-background border border-border/60 rounded focus:border-accent focus:outline-none"
                        >
                          {FONT_OPTIONS.map(f => <option key={f.label} value={f.value}>{f.label}</option>)}
                        </select>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            value={design.descColor}
                            onChange={(e) => setDesign({...design, descColor: e.target.value})}
                            className="w-8 h-8 rounded cursor-pointer shrink-0 border-none bg-transparent" 
                          />
                          <div className="flex-1 flex items-center gap-2">
                            <input 
                              type="range" min="12" max="60" 
                              value={design.descSize}
                              onChange={(e) => setDesign({...design, descSize: parseInt(e.target.value)})}
                              className="w-full accent-primary" 
                            />
                            <span className="text-xs font-medium w-8 text-right">{design.descSize}px</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleGenerateAndSend}
                      className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
                    >
                      <Send className="w-4 h-4" /> Dispatch All
                    </button>
                  </div>
                </>
              ) : (
                /* Step 3: Live Queue Tracker */
                <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-sm flex-1 flex flex-col h-full overflow-hidden">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-accent" /> Dispatch Queue</h4>
                  
                  <div className="mb-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                      <span>{progress}% Completed</span>
                      <span>{liveJobs.filter(j => j.status === 'Completed').length} / {participants.length} Sent</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {liveJobs.map((job) => (
                      <div key={job.id} className="p-3 rounded-xl border border-border/40 bg-background/50 flex flex-col gap-1.5 relative overflow-hidden">
                        
                        <div className="flex justify-between items-center z-10">
                          <span className="font-semibold text-sm truncate pr-4">{job.name}</span>
                          
                          {job.status === 'Pending' && <span className="text-xs text-muted-foreground">Queued</span>}
                          {job.status === 'Generating' && <span className="text-xs text-amber-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Rendering Image...</span>}
                          {job.status === 'Sending' && <span className="text-xs text-blue-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Sending Email...</span>}
                          {job.status === 'Completed' && <span className="text-xs text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Sent</span>}
                        </div>
                        
                        <span className="text-xs text-muted-foreground z-10">{job.email}</span>
                        
                        {/* Status background hint */}
                        {job.status === 'Generating' && <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />}
                        {job.status === 'Sending' && <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />}
                        {job.status === 'Completed' && <div className="absolute inset-0 bg-green-500/5" />}
                      </div>
                    ))}
                  </div>

                  {!isGenerating && progress === 100 && (
                    <div className="mt-6 pt-4 border-t border-border/40">
                      <button 
                        onClick={() => {
                          setStep(1);
                          setTemplateImage(null);
                          setParticipants([]);
                          setSelectedEventId("");
                        }}
                        className="w-full py-3 bg-foreground text-background font-bold rounded-xl hover:scale-105 transition-all shadow-md"
                      >
                        Start New Batch
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Montserrat:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@400;500;700&display=swap');
      `}} />
    </div>
  );
}
