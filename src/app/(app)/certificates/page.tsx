"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
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
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RotateCcw,
  Sparkles,
  CalendarDays
} from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { 
  formatCertificateName, 
  DEFAULT_CERTIFICATE_TEMPLATE, 
  DEFAULT_CERTIFICATE_WORDING,
  buildCertificateWording 
} from "@/lib/certificate-utils";

const FONT_OPTIONS = [
  { label: 'Playfair Display (Default)', value: "'Playfair Display', Georgia, serif" },
  { label: 'Cinzel (Classic)', value: "'Cinzel', serif" },
  { label: 'Montserrat (Modern)', value: "'Montserrat', sans-serif" },
  { label: 'Great Vibes (Cursive)', value: "'Great Vibes', cursive" },
  { label: 'Roboto (Clean)', value: "'Roboto', sans-serif" },
];

export default function CertificatesPipelinePage() {
  const { events, addEmailJob, incrementCertificates, incrementEmails, addParticipant } = useStore();
  const [step, setStep] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState("");
  
  // Requirement 1: Preload default certificate template automatically
  const [templateImage, setTemplateImage] = useState<string>(DEFAULT_CERTIFICATE_TEMPLATE);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Live Tracking state
  const [liveJobs, setLiveJobs] = useState<{ id: string, name: string, email: string, status: string }[]>([]);
  const [currentRenderParticipant, setCurrentRenderParticipant] = useState<any | null>(null);

  // Selected event object
  const selectedEvent = useMemo(() => {
    return events.find(e => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // Requirements 2 & 3: Template Design State styled to match the provided default font & template
  const [design, setDesign] = useState({
    nameFont: "'Playfair Display', Georgia, serif",
    nameColor: '#111827',
    nameSize: 44,
    descFont: "'Montserrat', sans-serif",
    descText: buildCertificateWording("[EVENT NAME]", "[EVENT DATE]"),
    descColor: '#374151',
    descSize: 15,
    descAlign: 'center',
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const templateInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Requirement 3 & 5: Automatically synchronize event name and date into the certificate wording
  useEffect(() => {
    if (selectedEvent) {
      const eName = selectedEvent.name?.trim() || "[EVENT NAME]";
      const eDate = selectedEvent.date?.trim() || "[EVENT DATE]";
      setDesign(prev => ({
        ...prev,
        descText: buildCertificateWording(eName, eDate)
      }));
    } else {
      setDesign(prev => ({
        ...prev,
        descText: buildCertificateWording("[EVENT NAME]", "[EVENT DATE]")
      }));
    }
  }, [selectedEventId, selectedEvent]);

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTemplateImage(event.target?.result as string);
        toast.success("Custom template uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefaultTemplate = () => {
    setTemplateImage(DEFAULT_CERTIFICATE_TEMPLATE);
    toast.success("Reset to default preloaded template");
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!jsonData || jsonData.length === 0) {
        toast.error("The spreadsheet is empty.");
        return;
      }

      const parsed: any[] = [];
      jsonData.forEach((row, index) => {
        let name = "";
        let email = "";
        let year = "";
        let department = "";
        let registerNumber = "";

        for (const [rawKey, rawVal] of Object.entries(row)) {
          if (!rawVal) continue;
          const k = rawKey.trim().toLowerCase();
          const val = String(rawVal).replace(/^"|"$/g, '').trim();

          if (
            k === 'student name' || 
            k === 'student' || 
            k === 'name' || 
            k === 'full name' || 
            k === 'participant name' || 
            k === 'participant' || 
            k === 'candidate name' ||
            k === 'attendee' ||
            k === 'attendee name'
          ) {
            name = val;
          } else if (
            k === 'email' || 
            k === 'email address' || 
            k === 'student email' || 
            k === 'mail' || 
            k === 'e-mail'
          ) {
            email = val;
          } else if (k === 'year' || k === 'academic year' || k === 'class' || k === 'batch') {
            year = val;
          } else if (k === 'department' || k === 'dept' || k === 'branch' || k === 'major') {
            department = val;
          } else if (k === 'reg no' || k === 'register number' || k === 'reg_no' || k === 'roll no' || k === 'id') {
            registerNumber = val;
          }
        }

        if (name && email) {
          parsed.push({
            id: `P-${index}`,
            name,
            email,
            year: year || "3rd Year",
            department: department || "Engineering",
            registerNumber,
          });
        }
      });

      if (parsed.length === 0) {
        toast.error("No valid participants found. Please ensure columns include 'Name' (or 'Student Name') and 'Email'.");
        return;
      }

      setParticipants(parsed);
      toast.success(`Loaded ${parsed.length} participants from ${file.name}`);
    } catch (err: any) {
      console.error("Spreadsheet upload error:", err);
      toast.error("Failed to parse file: " + (err?.message || "Invalid spreadsheet format"));
    } finally {
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const deleteParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  // Requirement 2: Format participant name (max 3 components) for display & certificate generation
  const displayParticipant = currentRenderParticipant || participants[0] || { name: "Ewlin Anna" };
  const formattedDisplayName = useMemo(() => {
    return formatCertificateName(displayParticipant.name);
  }, [displayParticipant.name]);

  // Scaled font size to prevent layout breaks on long names
  const dynamicNameSize = useMemo(() => {
    if (formattedDisplayName.length > 24) {
      return Math.max(26, Math.round(design.nameSize * (24 / formattedDisplayName.length)));
    }
    return design.nameSize;
  }, [formattedDisplayName, design.nameSize]);

  // Requirement 3: Render bold tags for **[EVENT NAME]** and **[EVENT DATE]**
  const renderFormattedWording = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong 
            key={i} 
            className="font-bold text-gray-900 inline-block px-0.5" 
            style={{ fontWeight: 700, color: '#111827' }}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handleGenerateAndSend = async () => {
    if (!selectedEvent) {
      toast.error("Please select an event before dispatching certificates.");
      return;
    }

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
      
      // 1. Setup DOM for this specific participant (name will be formatted for certificate via formatCertificateName)
      setCurrentRenderParticipant(p);
      setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Generating' } : j));
      
      // Wait for React to render the new name in the DOM
      await new Promise(r => setTimeout(r, 200));
      
      const node = document.getElementById('certificate-render-node');
      if (node) {
        // 2. Snapshot the DOM node to an actual high-res image
        const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: null });
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // 3. Send email dispatch via real Gmail backend
        setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Sending' } : j));
        
        let sendStatus: 'Completed' | 'Failed' = 'Failed';
        try {
          const { googleAccessToken } = useStore.getState();
          const emailRes = await fetch('/api/certificates/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: p.name, // Keep original participant record intact
              email: p.email,
              imageDataUrl: dataUrl,
              subject: selectedEvent?.emailSubject || `Your Certificate for ${selectedEvent?.name}`,
              customBody: selectedEvent?.emailBody,
              googleAccessToken: googleAccessToken
            })
          });

          if (emailRes.ok) {
            sendStatus = 'Completed';
            setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Completed' } : j));
          } else {
            const errData = await emailRes.json().catch(() => ({}));
            console.error("Email dispatch failed for " + p.email, errData);
            setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Failed', error: errData.error } : j));
          }
        } catch (error) {
          console.error("Email dispatch failed", error);
          setLiveJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, status: 'Failed' } : j));
        }

        // 4. Save to global email queue state
        addEmailJob({
          eventId: selectedEventId,
          participantName: p.name,
          participantEmail: p.email,
          status: sendStatus,
          timestamp: new Date().toISOString()
        });

        // 5. Save participant to store
        addParticipant({
          name: p.name,
          email: p.email,
          event: selectedEvent?.name || "Event",
          year: p.year || "3rd Year",
          department: p.department || "Engineering",
          registerNumber: p.registerNumber || "",
          status: sendStatus === 'Completed' ? 'Verified' : 'Pending',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });

        incrementCertificates(1);
        if (sendStatus === 'Completed') {
          incrementEmails(1);
        }
      }

      setProgress(Math.round(((i + 1) / participants.length) * 100));
    }

    setIsGenerating(false);
    toast.success("Certificate generation and dispatch completed!");
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-10">
      <header className="flex flex-col border-b border-border/20 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">
          Certificate Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          Official Karunya / MATRIX template preloaded, automatic 3-component name alignment, and dynamic event synchronization.
        </p>
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
              
              {/* Event Selector & Live Sync Notification */}
              <div>
                <label className="block text-sm font-semibold mb-2">1. Select Event</label>
                {events.length === 0 ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-600">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">You need to create an event first. <Link href="/events" className="underline">Go to Events</Link></p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <select 
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border/60 rounded-xl focus:border-accent focus:outline-none transition-colors font-medium"
                    >
                      <option value="" disabled>Choose an event to synchronize details...</option>
                      {events.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.name} {e.date ? `(${e.date})` : ""}
                        </option>
                      ))}
                    </select>

                    {selectedEvent ? (
                      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-700 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                        <span>Synchronized: <strong>{selectedEvent.name}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" /> 
                          {selectedEvent.date ? selectedEvent.date : <span className="text-amber-500 italic">No date set in Event</span>}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 ml-1">
                        <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        Select an event to automatically synchronize its name and date into the certificate wording.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Template & Participants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 2. Certificate Template */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold">2. Certificate Template</label>
                    {templateImage !== DEFAULT_CERTIFICATE_TEMPLATE && (
                      <button 
                        type="button"
                        onClick={handleResetToDefaultTemplate}
                        className="text-xs text-accent hover:underline flex items-center gap-1 font-medium transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset to Default
                      </button>
                    )}
                  </div>

                  <div 
                    onClick={() => templateInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative overflow-hidden group ${
                      templateImage ? 'border-accent/50 bg-accent/5' : 'border-border/60 hover:bg-muted/30 hover:border-foreground/30'
                    }`}
                  >
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, application/pdf" 
                      ref={templateInputRef} 
                      onChange={handleTemplateUpload} 
                      className="hidden" 
                    />
                    
                    {/* Small thumbnail preview */}
                    <div className="w-32 h-20 rounded-lg overflow-hidden border border-border/40 shadow-sm mb-3 bg-white flex items-center justify-center">
                      <img 
                        src={templateImage} 
                        alt="Active Template Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {templateImage === DEFAULT_CERTIFICATE_TEMPLATE ? (
                      <>
                        <div className="flex items-center gap-1.5 text-accent font-semibold text-sm">
                          <Sparkles className="w-4 h-4" /> Default Karunya Template Active
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Preloaded & ready to generate • Click to upload custom</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-green-500 font-semibold text-sm">
                          <CheckCircle2 className="w-4 h-4" /> Custom Template Uploaded
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Click to replace or reset to default above</p>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Import Participants */}
                <div>
                  <label className="block text-sm font-semibold mb-2">3. Import Participants</label>
                  <div 
                    onClick={() => csvInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-[178px] ${
                      participants.length > 0 ? 'border-blue-500/50 bg-blue-500/5' : 'border-border/60 hover:bg-muted/30 hover:border-foreground/30'
                    }`}
                  >
                    <input 
                      type="file" 
                      accept=".csv, .xlsx, .xls, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                      ref={csvInputRef} 
                      onChange={handleCsvUpload} 
                      className="hidden" 
                    />
                    {participants.length > 0 ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-blue-500 mb-3" />
                        <p className="font-semibold text-foreground">{participants.length} Participants Loaded</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to replace spreadsheet</p>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-8 h-8 text-muted-foreground mb-3" />
                        <p className="font-semibold text-foreground">Upload Participants</p>
                        <p className="text-xs text-muted-foreground mt-1">CSV or Excel (.xlsx, .xls) with Name and Email</p>
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
                    <span className="text-xs text-muted-foreground font-medium">Names with &gt; 3 parts are automatically formatted on certificates.</span>
                  </div>
                  <div className="bg-background border border-border/50 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                          <th className="px-4 py-3">Original Name</th>
                          <th className="px-4 py-3">Certificate Name Preview</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Year</th>
                          <th className="px-4 py-3">Department</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {participants.map((p, index) => {
                          const formatted = formatCertificateName(p.name);
                          const isTruncated = formatted !== p.name.trim();

                          return (
                            <tr key={index} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-2 font-medium">
                                <input 
                                  value={p.name} 
                                  onChange={(e) => updateParticipant(index, 'name', e.target.value)} 
                                  className="w-full bg-transparent border-b border-transparent hover:border-border/60 focus:border-accent focus:outline-none"
                                />
                              </td>
                              <td className="px-4 py-2 text-xs">
                                <span className="font-semibold text-foreground/90">{formatted}</span>
                                {isTruncated && (
                                  <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 font-semibold" title="Trimmed to first 3 name components for certificate alignment">
                                    Max 3 words
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">
                                <input 
                                  value={p.email} 
                                  onChange={(e) => updateParticipant(index, 'email', e.target.value)} 
                                  className="w-full bg-transparent border-b border-transparent hover:border-border/60 focus:border-accent focus:outline-none"
                                />
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">
                                <input 
                                  value={p.year || ''} 
                                  placeholder="3rd Year"
                                  onChange={(e) => updateParticipant(index, 'year', e.target.value)} 
                                  className="w-full bg-transparent border-b border-transparent hover:border-border/60 focus:border-accent focus:outline-none text-xs"
                                />
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">
                                <input 
                                  value={p.department || ''} 
                                  placeholder="Engineering"
                                  onChange={(e) => updateParticipant(index, 'department', e.target.value)} 
                                  className="w-full bg-transparent border-b border-transparent hover:border-border/60 focus:border-accent focus:outline-none text-xs"
                                />
                              </td>
                              <td className="px-4 py-2 text-right">
                                <button 
                                  onClick={() => deleteParticipant(index)}
                                  className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                                  title="Remove participant"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Proceed to Designer */}
              <div className="flex justify-end pt-4 border-t border-border/20">
                <button 
                  onClick={() => {
                    if (!selectedEventId) {
                      toast.error("Please select an event before proceeding.");
                      return;
                    }
                    if (participants.length === 0) {
                      toast.error("Please import participants before proceeding.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
                >
                  Configure & Preview <ChevronRight className="w-4 h-4" />
                </button>
              </div>

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
                  <h3 className="text-xl font-bold">{step === 2 ? "Template Designer & Preview" : "Live Rendering Engine"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step === 2 
                      ? "Centered participant name alignment and bold event details synchronized from your event." 
                      : "Rendering high-resolution certificates and dispatching..."
                    }
                  </p>
                </div>
                {step === 2 && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                    <Move className="w-3.5 h-3.5" /> Draggable Blocks
                  </div>
                )}
              </div>
              
              <div className="relative w-full aspect-[1.417/1] bg-white rounded-xl border border-border/60 overflow-hidden shadow-md flex items-center justify-center">
                
                {/* RENDER NODE - This exact div is snapshotted by HTML2Canvas */}
                <div id="certificate-render-node" className="absolute inset-0 w-full h-full bg-white overflow-hidden">
                  
                  {/* Template Image / Background */}
                  {templateImage && (
                    templateImage.startsWith("data:application/pdf") ? (
                      <object data={templateImage} type="application/pdf" className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" aria-label="Template PDF">
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-card">PDF Template Loaded</div>
                      </object>
                    ) : (
                      <img 
                        src={templateImage} 
                        alt="Certificate Template" 
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" 
                        crossOrigin="anonymous" 
                      />
                    )
                  )}
                  
                  {/* Draggable Overlays calibrated to the default Karunya/MATRIX template */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    
                    {/* Requirement 2: Automatic Centered Participant Name Overlay (Max 3 components, matching font from image 2) */}
                    <motion.div 
                      drag={step === 2}
                      dragMomentum={false}
                      className={`absolute pointer-events-auto p-1.5 border rounded-lg transition-colors group flex items-center justify-center
                        ${step === 2 ? 'cursor-move border-transparent hover:border-accent/50 hover:bg-accent/5' : 'border-transparent'}
                      `}
                      style={{ top: '54.5%', left: '50%', x: '-50%', y: '-50%', maxWidth: '82%' }}
                    >
                      <h2 
                        className="whitespace-nowrap leading-none tracking-tight text-center font-bold" 
                        style={{ 
                          fontFamily: design.nameFont, 
                          color: design.nameColor, 
                          fontSize: `${dynamicNameSize}px`,
                          fontWeight: 700
                        }}
                      >
                        {formattedDisplayName}
                      </h2>
                      {step === 2 && (
                        <div className="absolute -top-3 -right-3 bg-accent text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Name (Centered)
                        </div>
                      )}
                    </motion.div>

                    {/* Requirement 3: Certificate Text Overlay with Dynamic Bold Event Name and Date */}
                    <motion.div 
                      drag={step === 2}
                      dragMomentum={false}
                      className={`absolute pointer-events-auto p-2 border rounded-lg transition-colors group max-w-xl w-[78%]
                        ${step === 2 ? 'cursor-move border-transparent hover:border-accent/50 hover:bg-accent/5' : 'border-transparent'}
                        ${design.descAlign === 'left' ? 'text-left' : design.descAlign === 'right' ? 'text-right' : design.descAlign === 'justify' ? 'text-justify' : 'text-center'}
                      `}
                      style={{ top: '69.5%', left: '50%', x: '-50%', y: '-50%' }}
                    >
                      <p 
                        className="leading-relaxed" 
                        style={{ 
                          fontFamily: design.descFont, 
                          color: design.descColor, 
                          fontSize: `${design.descSize}px`,
                          lineHeight: '1.55'
                        }}
                      >
                        {renderFormattedWording(design.descText)}
                      </p>
                      {step === 2 && (
                        <div className="absolute -top-3 -right-3 bg-accent text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Certificate Text
                        </div>
                      )}
                    </motion.div>

                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar Changes Based on Step */}
            <div className="w-full xl:w-[360px] flex flex-col gap-6">
              
              {step === 2 ? (
                /* Step 2: Editor Tools (Requirements 3, 4, 5: Clean, unified, no duplicate event/date inputs) */
                <>
                  <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-6 shadow-sm flex-1 max-h-[800px] overflow-y-auto custom-scrollbar">
                    <h4 className="font-bold mb-6 flex items-center gap-2 border-b border-border/40 pb-3">
                      <Settings className="w-4 h-4 text-accent" /> Editor Tools
                    </h4>
                    
                    {/* Live Event Sync Status */}
                    {selectedEvent && (
                      <div className="mb-6 p-3 bg-muted/40 border border-border/40 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Linked Event Details</span>
                        <div className="text-xs font-semibold text-foreground truncate">{selectedEvent.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" /> {selectedEvent.date || "Date not set"}
                        </div>
                      </div>
                    )}

                    {/* Certificate Wording Input */}
                    <div className="space-y-4 mb-6">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5" /> Certificate Wording
                      </label>
                      
                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase ml-1">
                          Dynamic Wording (**bold**)
                        </span>
                        <textarea 
                          value={design.descText}
                          onChange={(e) => setDesign({...design, descText: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-xl focus:border-accent focus:outline-none transition-colors text-sm resize-none mt-1"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Words inside <code className="bg-muted px-1 rounded">**bold**</code> appear in bold on the certificate.
                        </p>
                        
                        <div className="flex gap-1 mt-2">
                          <button 
                            type="button"
                            onClick={() => setDesign({...design, descAlign: 'left'})} 
                            className={`p-1.5 rounded ${design.descAlign === 'left' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-muted'}`}
                            title="Align Left"
                          >
                            <AlignLeft className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setDesign({...design, descAlign: 'center'})} 
                            className={`p-1.5 rounded ${design.descAlign === 'center' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-muted'}`}
                            title="Align Center"
                          >
                            <AlignCenter className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setDesign({...design, descAlign: 'right'})} 
                            className={`p-1.5 rounded ${design.descAlign === 'right' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-muted'}`}
                            title="Align Right"
                          >
                            <AlignRight className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setDesign({...design, descAlign: 'justify'})} 
                            className={`p-1.5 rounded ${design.descAlign === 'justify' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-muted'}`}
                            title="Justify"
                          >
                            <AlignJustify className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Typography Settings */}
                    <div className="space-y-5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" /> Typography & Styling
                      </label>
                      
                      {/* Name Typography */}
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
                            title="Name Color"
                          />
                          <div className="flex-1 flex items-center gap-2">
                            <input 
                              type="range" min="20" max="100" 
                              value={design.nameSize}
                              onChange={(e) => setDesign({...design, nameSize: parseInt(e.target.value)})}
                              className="w-full accent-primary" 
                            />
                            <span className="text-xs font-medium w-8 text-right">{design.nameSize}px</span>
                          </div>
                        </div>
                      </div>

                      {/* Description Typography */}
                      <div className="bg-muted/20 p-3 rounded-xl border border-border/30 space-y-3">
                        <span className="text-xs font-semibold block">Certificate Wording Text</span>
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
                            title="Text Color"
                          />
                          <div className="flex-1 flex items-center gap-2">
                            <input 
                              type="range" min="12" max="40" 
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
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" /> Dispatch Queue
                  </h4>
                  
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
                          {job.status === 'Failed' && <span className="text-xs text-red-500 flex items-center gap-1">Failed</span>}
                        </div>
                        
                        <span className="text-xs text-muted-foreground z-10">{job.email}</span>
                        
                        {job.status === 'Generating' && <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />}
                        {job.status === 'Sending' && <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />}
                        {job.status === 'Completed' && <div className="absolute inset-0 bg-green-500/5" />}
                        {job.status === 'Failed' && <div className="absolute inset-0 bg-red-500/5" />}
                      </div>
                    ))}
                  </div>

                  {!isGenerating && progress === 100 && (
                    <div className="mt-6 pt-4 border-t border-border/40">
                      <button 
                        onClick={() => {
                          setStep(1);
                          setTemplateImage(DEFAULT_CERTIFICATE_TEMPLATE);
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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Roboto:wght@400;500;700&display=swap');
      `}} />
    </div>
  );
}
