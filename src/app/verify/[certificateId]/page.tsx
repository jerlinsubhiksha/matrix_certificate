import React from "react";
import { CheckCircle2, ShieldCheck, Download, AlertTriangle } from "lucide-react";
import "@/app/globals.css";

// This would typically be a server component fetching from Firebase Admin
export default async function VerifyPage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  
  // Mock data fetching
  const isValid = !certificateId.includes("REVOKED") && !certificateId.includes("INVALID");
  const isRevoked = certificateId.includes("REVOKED");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans text-[#0F172A]">
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">MATRIX</h1>
        <p className="text-[#64748B] text-sm mt-1">Official Certification Record</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-[#E2E8F0] overflow-hidden">
        
        {/* Status Header */}
        <div className={`p-8 text-center border-b ${
          isValid ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 
          isRevoked ? 'bg-red-50 border-red-100 text-red-900' : 
          'bg-gray-50 border-gray-200 text-gray-900'
        }`}>
          <div className="flex justify-center mb-4">
            {isValid ? (
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center ring-8 ring-emerald-50">
                <CheckCircle2 size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center ring-8 ring-red-50">
                <AlertTriangle size={32} />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isValid ? "VERIFIED CERTIFICATE" : isRevoked ? "CERTIFICATE REVOKED" : "CERTIFICATE NOT FOUND"}
          </h2>
          <p className={`mt-2 text-sm ${isValid ? 'text-emerald-700' : 'text-red-700'}`}>
            {isValid ? "This certificate is authentic and securely recorded on the Matrix platform." : "This certificate is no longer considered valid."}
          </p>
        </div>

        {/* Certificate Data */}
        {isValid && (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Recipient</p>
                <p className="font-medium text-lg text-gray-400 italic">[Recipient Name]</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Event</p>
                <p className="font-medium text-lg text-gray-400 italic">[Event Name]</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Achievement</p>
                <p className="font-medium text-lg text-gray-400 italic">[Achievement]</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Issue Date</p>
                <p className="font-medium text-lg text-gray-400 italic">[Date]</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E8F0]">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Certificate ID</p>
              <p className="font-mono font-medium text-[#0F172A] bg-gray-50 px-3 py-2 rounded-lg inline-block border border-gray-200">
                {certificateId}
              </p>
            </div>
            
            <div className="pt-6 flex gap-3">
               <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0F172A] text-white rounded-xl font-medium hover:bg-[#1E293B] transition-colors shadow-sm">
                  View Certificate
               </button>
               <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
                  <Download size={18} />
               </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-sm text-[#64748B]">
        <ShieldCheck size={16} className="text-blue-500" />
        Secured by Matrix Certification Architecture
      </div>
    </div>
  );
}
