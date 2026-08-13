"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, FileSignature, Edit, Copy, History } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
  { id: "1", name: "Annual Excellence Award", version: "Version 3", status: "Published", date: "12 Aug 2026" },
  { id: "2", name: "Hackathon Winner", version: "Version 1", status: "Draft", date: "13 Aug 2026" },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#0F172A] tracking-tight">Templates</h1>
          <p className="text-[#64748B] mt-2">Manage and design your certificate templates.</p>
        </div>
        <Link href="/admin/templates/new/editor">
          <button className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1E293B] transition-colors shadow-sm">
            <Plus size={18} />
            Create Template
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TEMPLATES.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="group bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:border-blue-200 transition-all cursor-pointer overflow-hidden flex flex-col"
          >
            {/* Template Preview Mockup Area */}
            <div className="h-48 bg-gray-50 border-b border-[#E2E8F0] relative flex items-center justify-center p-4">
              <div className="w-full h-full bg-white shadow-sm border border-gray-200 flex flex-col items-center justify-center relative transform group-hover:scale-105 transition-transform duration-500 ease-out">
                <FileSignature className="text-blue-200 w-12 h-12 mb-2" />
                <div className="w-16 h-1 bg-gray-200 rounded-full mb-1" />
                <div className="w-24 h-1 bg-gray-200 rounded-full mb-4" />
                <div className="w-20 h-1 bg-gray-200 rounded-full" />
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link href={`/admin/templates/${template.id}/editor`}>
                    <button className="bg-white text-[#0F172A] px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm hover:shadow flex items-center gap-1.5">
                      <Edit size={14} /> Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-[#0F172A] truncate pr-2">{template.name}</h3>
                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#64748B] bg-gray-100 px-2 py-0.5 rounded-md">
                  {template.version}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  template.status === 'Published' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {template.status === 'Published' ? '● Published' : '◌ Draft'}
                </span>
              </div>
              <p className="text-xs text-gray-400">Updated {template.date}</p>
            </div>
            
            {/* Hover bottom actions bar */}
            <div className="h-0 group-hover:h-12 border-t border-transparent group-hover:border-[#E2E8F0] overflow-hidden transition-all duration-300 bg-gray-50 flex items-center justify-around px-2 text-xs text-[#64748B] font-medium">
              <button className="flex items-center gap-1.5 hover:text-[#0F172A] p-2"><Copy size={14} /> Duplicate</button>
              <button className="flex items-center gap-1.5 hover:text-[#0F172A] p-2"><History size={14} /> History</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
