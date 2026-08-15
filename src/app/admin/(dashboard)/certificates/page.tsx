"use client";

import React, { useState } from "react";
import { Search, Filter, MoreHorizontal, CheckCircle2, CircleDashed, Download, Eye, XCircle } from "lucide-react";

// Mock data
const CERTIFICATES: any[] = [];

export default function AdminCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] tracking-tight">Certificates</h1>
        <p className="text-[#64748B] mt-2">Manage, approve, and revoke certificates across all events.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or Recipient..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 transition-colors shadow-sm">
              <Filter size={16} />
              Filter: All
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#0F172A] text-white rounded-xl text-sm font-medium hover:bg-[#1E293B] transition-colors shadow-sm">
              Batch Approve
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-1/4">Recipient</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-1/4">Event</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-1/5">Certificate ID</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-32">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CERTIFICATES.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                CERTIFICATES.map((cert) => (
                <tr key={cert.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-[#0F172A]">{cert.recipient}</td>
                  <td className="py-4 px-6 text-sm text-[#64748B]">{cert.event}</td>
                  <td className="py-4 px-6 text-sm font-mono text-gray-500">{cert.id}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                      ${cert.status === 'ISSUED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                      ${cert.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
                      ${cert.status === 'REVOKED' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                    `}>
                      {cert.status === 'ISSUED' && <CheckCircle2 size={14} />}
                      {cert.status === 'PENDING_APPROVAL' && <CircleDashed size={14} className="animate-[spin_4s_linear_infinite]" />}
                      {cert.status === 'REVOKED' && <XCircle size={14} />}
                      {cert.status === 'PENDING_APPROVAL' ? 'Pending' : cert.status.charAt(0) + cert.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-gray-400 hover:text-[#0F172A] transition-colors p-1.5 rounded-lg hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {/* Hover Actions Menu (Simulated) */}
                    <div className="absolute right-10 mt-[-30px] hidden group-hover:flex items-center gap-1 bg-white border border-[#E2E8F0] shadow-lg rounded-lg p-1 animate-in fade-in zoom-in-95 duration-100">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors tooltip-trigger" title="Preview">
                        <Eye size={16} />
                      </button>
                      {cert.status === 'ISSUED' && (
                        <button className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Download">
                          <Download size={16} />
                        </button>
                      )}
                      {cert.status === 'PENDING_APPROVAL' && (
                        <button className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors font-medium text-xs">
                          Approve
                        </button>
                      )}
                      {cert.status === 'ISSUED' && (
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Revoke">
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Toolbar */}
        <div className="p-4 border-t border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center text-sm text-[#64748B]">
          <span>Showing 0 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 bg-[#0F172A] text-white border border-[#0F172A] rounded-lg">1</button>
            <button className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg hover:bg-gray-50 text-[#0F172A]">2</button>
            <button className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg hover:bg-gray-50 text-[#0F172A]">3</button>
            <button className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg hover:bg-gray-50 text-[#0F172A]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
