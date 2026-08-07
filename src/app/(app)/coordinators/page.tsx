"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Activity, 
  Power,
  ChevronLeft,
  ChevronRight,
  UsersRound
} from "lucide-react";

// Mock Data
const MOCK_COORDINATORS: any[] = [];

export default function CoordinatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coordinators</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system access and roles for your event coordinators.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add Coordinator
        </button>
      </header>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search coordinators by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border/60 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-muted-foreground">
            <Filter className="w-4 h-4" />
            Filter by Role
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border/60 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-muted-foreground">
            Status: All
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-visible relative shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/40 border-b border-border/60 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/40">
              {MOCK_COORDINATORS.length > 0 ? (
                MOCK_COORDINATORS.map((coord) => (
                  <tr key={coord.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                        {coord.name.charAt(0)}
                      </div>
                      {coord.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{coord.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium border border-border/50">
                        {coord.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${coord.status === 'Active' ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <span className={`w-2 h-2 rounded-full ${coord.status === 'Active' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        {coord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{coord.lastActive}</td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === coord.id ? null : coord.id)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Action Dropdown */}
                      {activeDropdown === coord.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-6 top-10 w-48 bg-card border border-border/80 rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-left">
                              <Edit className="w-4 h-4 text-muted-foreground" /> Edit Details
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-left">
                              <Activity className="w-4 h-4 text-muted-foreground" /> View Activity
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-left">
                              <Power className="w-4 h-4 text-muted-foreground" /> 
                              {coord.status === 'Active' ? 'Disable Access' : 'Enable Access'}
                            </button>
                            <div className="h-px w-full bg-border/40 my-1"></div>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 hover:text-red-500 transition-colors text-left text-red-500/80">
                              <Trash2 className="w-4 h-4" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <UsersRound className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="font-medium text-sm text-foreground mb-1">No coordinators found</p>
                      <p className="text-xs max-w-sm mx-auto">You haven't added any event coordinators to the system yet.</p>
                      <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">
                        <Plus className="w-4 h-4" />
                        Add Coordinator
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/10">
          <span className="text-xs text-muted-foreground">Showing 1 to 5 of 12 coordinators</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-md bg-accent text-white text-xs font-semibold flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded-md hover:bg-muted text-muted-foreground text-xs font-semibold flex items-center justify-center transition-colors">2</button>
            <button className="w-7 h-7 rounded-md hover:bg-muted text-muted-foreground text-xs font-semibold flex items-center justify-center transition-colors">3</button>
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
