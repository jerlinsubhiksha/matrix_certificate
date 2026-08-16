import React from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { CoordinatorAuthGuard } from "@/components/coordinator-auth-guard";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Coordinator | Matrix Certification",
  description: "Coordinator portal for Matrix Certification.",
};

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CoordinatorAuthGuard>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className={`${inter.variable} font-sans min-h-screen bg-background text-foreground flex overflow-hidden`}>
          <Sidebar type="coordinator" />
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />
            <TopHeader />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 custom-scrollbar">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </CoordinatorAuthGuard>
  );
}
