"use client";

import React, { useRef, useState } from "react";

interface CertificatePreviewProps {
  templateUrl: string | null;
  name: string;
  eventDescription: string;
  className?: string;
}

export function CertificatePreview({ templateUrl, name, eventDescription, className = "" }: CertificatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // We want the text to scale relative to the container size so it looks the same in preview as final.
  // For simplicity, we use absolute percentage positioning. 
  // Name is typically large and centered.
  // Event description is typically smaller and below the name.

  if (!templateUrl) {
    return (
      <div className={`w-full aspect-[1.414/1] bg-muted/30 border border-dashed border-border/50 rounded-xl flex items-center justify-center text-muted-foreground ${className}`}>
        No template uploaded
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-[1.414/1] bg-background shadow-lg overflow-hidden border border-border/40 rounded-xl ${className}`}
    >
      {/* Background Template */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={templateUrl} 
        alt="Certificate Template" 
        className="w-full h-full object-cover"
        onLoad={() => setImgLoaded(true)}
      />
      
      {/* Overlay Text */}
      {imgLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* You can adjust these margins/positions as needed for specific templates */}
          <div className="absolute top-[45%] w-[80%] text-center">
            <h1 
              className="font-serif font-bold text-gray-800 drop-shadow-sm leading-tight"
              style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
            >
              {name || "Participant Name"}
            </h1>
          </div>
          
          <div className="absolute top-[65%] w-[70%] text-center">
            <p 
              className="font-sans text-gray-700 leading-snug drop-shadow-sm"
              style={{ fontSize: "clamp(12px, 1.5vw, 20px)" }}
            >
              {eventDescription || "Event Description"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
