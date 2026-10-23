"use client";

import React, { useRef, useState } from "react";
import { formatCertificateName, DEFAULT_CERTIFICATE_TEMPLATE } from "@/lib/certificate-utils";

interface CertificatePreviewProps {
  templateUrl?: string | null;
  name: string;
  eventDescription: string;
  className?: string;
}

export function CertificatePreview({ 
  templateUrl = DEFAULT_CERTIFICATE_TEMPLATE, 
  name, 
  eventDescription, 
  className = "" 
}: CertificatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const activeTemplate = templateUrl || DEFAULT_CERTIFICATE_TEMPLATE;
  const displayName = formatCertificateName(name || "Participant Name");

  // Helper to render markdown bold in eventDescription
  const renderFormattedDescription = (text: string) => {
    if (!text) return "Event Description";
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-gray-900" style={{ fontWeight: 700, color: "#111827" }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-[1.417/1] bg-white shadow-lg overflow-hidden border border-border/40 rounded-xl ${className}`}
    >
      {/* Background Template */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={activeTemplate} 
        alt="Certificate Template" 
        className="w-full h-full object-contain"
        onLoad={() => setImgLoaded(true)}
      />
      
      {/* Overlay Text aligned to official template layout */}
      {imgLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* Centered Participant Name matching Playfair Display bold font */}
          <div className="absolute top-[54.5%] w-[82%] text-center -translate-y-1/2">
            <h1 
              className="font-serif font-bold text-gray-900 drop-shadow-sm leading-tight tracking-tight truncate"
              style={{ 
                fontFamily: "'Playfair Display', Georgia, serif", 
                fontWeight: 700,
                fontSize: "clamp(20px, 3.5vw, 42px)",
                color: "#111827"
              }}
            >
              {displayName}
            </h1>
          </div>
          
          {/* Dynamic wording sentence with bold event name & date */}
          <div className="absolute top-[69.5%] w-[76%] text-center -translate-y-1/2">
            <p 
              className="font-sans text-gray-700 leading-relaxed drop-shadow-sm"
              style={{ 
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(11px, 1.3vw, 15px)",
                color: "#374151",
                lineHeight: "1.55"
              }}
            >
              {renderFormattedDescription(eventDescription)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
