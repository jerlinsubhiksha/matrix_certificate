"use client";

import React, { useState, use } from "react";
import { ArrowLeft, Save, Send, Type, Image as ImageIcon, QrCode, PenTool, Hash, LayoutTemplate, Settings2 } from "lucide-react";
import Link from "next/link";

export default function TemplateEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";

  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-[calc(100vh-64px)] -m-8 flex flex-col bg-gray-50 overflow-hidden">
      {/* Editor Header */}
      <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/templates">
            <button className="text-[#64748B] hover:text-[#0F172A] transition-colors p-1">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          <input 
            type="text" 
            defaultValue={isNew ? "Untitled Template" : "Annual Excellence Award"}
            className="text-lg font-semibold text-[#0F172A] bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-100 rounded px-2 -ml-2"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 mr-2">Last saved just now</span>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-gray-50 rounded-lg text-sm font-medium text-[#0F172A] transition-colors shadow-sm">
            <Save size={16} />
            Save Draft
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors shadow-sm">
            <Send size={16} />
            Publish Version
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Elements Toolbar */}
        <div className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col z-10 overflow-y-auto">
          <div className="p-4 border-b border-[#E2E8F0]">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all text-[#0F172A]">
                <Type size={20} className="text-blue-600" />
                <span className="text-xs font-medium">Text</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all text-[#0F172A]">
                <Hash size={20} className="text-indigo-600" />
                <span className="text-xs font-medium text-center">Dynamic<br/>Field</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all text-[#0F172A]">
                <QrCode size={20} className="text-emerald-600" />
                <span className="text-xs font-medium">QR Code</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all text-[#0F172A]">
                <ImageIcon size={20} className="text-amber-600" />
                <span className="text-xs font-medium">Image</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all text-[#0F172A]">
                <PenTool size={20} className="text-purple-600" />
                <span className="text-xs font-medium">Signature</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all text-[#0F172A]">
                <LayoutTemplate size={20} className="text-rose-600" />
                <span className="text-xs font-medium text-center">Background</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center - Canvas Workspace */}
        <div className="flex-1 bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center p-8">
          {/* Zoom controls */}
          <div className="absolute bottom-6 right-6 bg-white border border-[#E2E8F0] shadow-sm rounded-lg flex items-center p-1 z-20">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:bg-gray-100 rounded text-gray-500">-</button>
            <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 hover:bg-gray-100 rounded text-gray-500">+</button>
          </div>

          {/* Canvas Wrapper */}
          <div 
            className="bg-white shadow-[0_8px_30px_rgba(15,23,42,0.1)] transition-transform duration-200 origin-center relative border border-gray-200"
            style={{ 
              width: "1123px", // A4 Landscape roughly at 96dpi
              height: "794px", 
              transform: `scale(${zoom / 100})` 
            }}
          >
            {/* Grid Pattern overlay for alignment */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
            
            {/* Mock Elements */}
            <div className="absolute top-16 left-0 right-0 text-center font-bold text-5xl tracking-widest text-[#0F172A]">
              CERTIFICATE
            </div>
            
            <div className="absolute top-40 left-0 right-0 text-center text-lg text-[#64748B] uppercase tracking-widest">
              Proudly presented to
            </div>
            
            {/* Selected Element Mock */}
            <div className="absolute top-64 left-1/2 -translate-x-1/2 p-2 border-2 border-blue-500 cursor-move group">
              <div className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nwse-resize" />
              <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nesw-resize" />
              <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-swne-resize" />
              <div className="absolute -bottom-2.5 -right-2.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nwse-resize" />
              
              <div className="text-6xl font-serif text-blue-900 px-4 py-2 bg-blue-50/50">
                {`{{recipientName}}`}
              </div>
            </div>

            <div className="absolute bottom-24 right-24 w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400">
              <QrCode size={48} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-72 bg-white border-l border-[#E2E8F0] flex flex-col z-10">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-2">
            <Settings2 size={18} className="text-[#64748B]" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Properties</h3>
          </div>
          
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Text Properties Mock */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Typography</label>
              <div className="space-y-2">
                <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option>Playfair Display</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-xs text-gray-400 w-8">Size</span>
                    <input type="number" defaultValue={60} className="w-full bg-transparent text-sm focus:outline-none text-right" />
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-xs text-gray-400 w-8">Wght</span>
                    <select className="w-full bg-transparent text-sm focus:outline-none text-right appearance-none">
                      <option>Bold</option>
                      <option>Regular</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Position & Size</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-xs text-gray-400 w-4">X</span>
                  <input type="number" defaultValue={230} className="w-full bg-transparent text-sm focus:outline-none text-right" />
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-xs text-gray-400 w-4">Y</span>
                  <input type="number" defaultValue={450} className="w-full bg-transparent text-sm focus:outline-none text-right" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Data Binding</label>
              <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-blue-50 text-blue-800 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-100">
                <option value="recipientName">recipientName</option>
                <option value="eventName">eventName</option>
                <option value="issueDate">issueDate</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
