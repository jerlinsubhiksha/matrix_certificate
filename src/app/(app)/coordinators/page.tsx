"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MoreVertical, 
  Trash2, 
  Power,
  ChevronLeft,
  ChevronRight,
  UsersRound,
  UserPlus,
  Edit,
  X
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function CoordinatorsPage() {
  const { coordinators, addCoordinator, updateCoordinator, deleteCoordinator } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCoord, setEditingCoord] = useState<any>(null);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@") || !newName) return;
    
    setIsAdding(true);
    
    const newCoord = {
      name: newName,
      email: newEmail,
      role: "Event Coordinator",
      status: "Active" as "Active" | "Inactive"
    };

    try {
      const res = await fetch('/api/coordinators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoord)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save to database");
      }
      
      addCoordinator(newCoord);
      setNewName("");
      setNewEmail("");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoord || !editingCoord.name || !editingCoord.email) return;

    try {
      // First create or update on server
      const res = await fetch('/api/coordinators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCoord)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update database");
      }
      
      updateCoordinator(editingCoord.id, editingCoord);
      setIsEditModalOpen(false);
      setEditingCoord(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (coord: any) => {
    if (!confirm(`Are you sure you want to remove ${coord?.name || 'this coordinator'}?`)) return;
    try {
      const res = await fetch(`/api/coordinators?email=${encodeURIComponent(coord?.email || '')}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete from database");
      }
      deleteCoordinator(coord.id);
      setActiveDropdown(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleToggleStatus = async (coord: any) => {
    const newStatus = coord.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch('/api/coordinators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...coord, status: newStatus })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update database");
      }
      updateCoordinator(coord.id, { status: newStatus });
      setActiveDropdown(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Reset page if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!mounted) return null;

  const safeCoordinators = Array.isArray(coordinators) ? coordinators : [];
  const filteredCoordinators = safeCoordinators.filter(c => {
    const nameStr = c?.name || "";
    const emailStr = c?.email || "";
    return nameStr.toLowerCase().includes(searchQuery.toLowerCase()) || emailStr.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredCoordinators.length / itemsPerPage));
  const paginatedCoordinators = filteredCoordinators.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Coordinators</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system access and roles for your event coordinators.</p>
        </div>
        
        {/* Quick Add Form */}
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row items-center gap-2">
          <input 
            type="text" 
            placeholder="Coordinator Name" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            className="w-full sm:w-48 px-4 py-2.5 bg-card backdrop-blur-md border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm shadow-sm"
          />
          <input 
            type="email" 
            placeholder="Coordinator Email" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="w-full sm:w-64 px-4 py-2.5 bg-card backdrop-blur-md border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm shadow-sm"
          />
          <button 
            type="submit"
            disabled={isAdding}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            title="Add Coordinator"
          >
            {isAdding ? (
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </form>
      </header>

      {/* Action Bar (Only Search now) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search coordinators by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card backdrop-blur-md border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card backdrop-blur-xl border border-border/60 rounded-xl overflow-visible relative shadow-sm flex flex-col min-h-[400px]"
      >
        <div className="overflow-visible flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/40 border-b border-border/60 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/40">
              {paginatedCoordinators.length > 0 ? (
                paginatedCoordinators.map((coord) => (
                  <tr key={coord?.id || Math.random().toString()} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                        {(coord?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      {coord?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{coord?.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium border border-border/50">
                        {coord?.role || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${coord?.status === 'Active' ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <span className={`w-2 h-2 rounded-full ${coord?.status === 'Active' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        {coord?.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === coord?.id ? null : coord?.id)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Action Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === coord?.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setActiveDropdown(null)}
                            />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-6 top-10 w-48 bg-background/95 backdrop-blur-3xl border border-border/80 rounded-xl shadow-2xl z-50 py-1 overflow-hidden"
                            >
                              <button 
                                onClick={() => {
                                  setEditingCoord({ ...coord });
                                  setIsEditModalOpen(true);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-left"
                              >
                                <Edit className="w-4 h-4 text-muted-foreground" /> 
                                Edit Coordinator
                              </button>
                              <button 
                                onClick={() => handleToggleStatus(coord)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-left"
                              >
                                <Power className="w-4 h-4 text-muted-foreground" /> 
                                {coord?.status === 'Active' ? 'Disable Access' : 'Enable Access'}
                              </button>
                              <div className="h-px w-full bg-border/40 my-1"></div>
                              <button 
                                onClick={() => handleDelete(coord)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 hover:text-red-500 transition-colors text-left text-red-500/80"
                              >
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <UsersRound className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="font-medium text-sm text-foreground mb-1">No coordinators found</p>
                      <p className="text-xs max-w-sm mx-auto">Try adjusting your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredCoordinators.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/10 mt-auto">
            <span className="text-xs text-muted-foreground">Showing {paginatedCoordinators.length} of {filteredCoordinators.length} coordinators</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 rounded-md bg-accent text-white text-xs font-semibold flex items-center justify-center">{currentPage}</button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Edit Modal (Simple, non-animated strictly conditionally rendered to avoid framer-motion issues) */}
      {isEditModalOpen && editingCoord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <h2 className="text-xl font-bold">Edit Coordinator</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  value={editingCoord.name}
                  onChange={(e) => setEditingCoord({...editingCoord, name: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={editingCoord.email}
                  onChange={(e) => setEditingCoord({...editingCoord, email: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
