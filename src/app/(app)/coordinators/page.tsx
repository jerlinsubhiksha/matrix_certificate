"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Power,
  ChevronLeft,
  ChevronRight,
  UsersRound,
  X
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function CoordinatorsPage() {
  const { coordinators, addCoordinator, updateCoordinator, deleteCoordinator } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filtering & Pagination
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [newCoordinator, setNewCoordinator] = useState({
    name: "",
    email: "",
    role: "Event Coordinator",
    status: "Active" as const
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoordinator.name || !newCoordinator.email) return;
    
    if (editingId) {
      updateCoordinator(editingId, newCoordinator);
    } else {
      addCoordinator(newCoordinator);
    }
    
    setIsModalOpen(false);
    setNewCoordinator({ name: "", email: "", role: "Event Coordinator", status: "Active" });
    setEditingId(null);
  };

  const handleEdit = (coord: any) => {
    setNewCoordinator({ name: coord.name, email: coord.email, role: coord.role, status: coord.status });
    setEditingId(coord.id);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  // Reset page if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  if (!mounted) return null;

  // Apply Filters
  const filteredCoordinators = coordinators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || c.role === roleFilter;
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Apply Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCoordinators.length / itemsPerPage));
  const paginatedCoordinators = filteredCoordinators.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 dark:from-blue-400 dark:to-pink-400 drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]">Coordinators</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system access and roles for your event coordinators.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewCoordinator({ name: "", email: "", role: "Event Coordinator", status: "Active" });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
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
            className="w-full pl-10 pr-4 py-2 bg-card backdrop-blur-md border border-border/60 rounded-lg focus:outline-none focus:border-accent/50 transition-colors text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-card backdrop-blur-md border border-border/60 rounded-lg text-sm font-medium focus:outline-none focus:border-accent/50 text-muted-foreground cursor-pointer"
          >
            <option value="All">Filter by Role</option>
            <option value="Event Coordinator">Event Coordinator</option>
            <option value="Lead Coordinator">Lead Coordinator</option>
            <option value="Admin">Admin</option>
          </select>
          <select 
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-card backdrop-blur-md border border-border/60 rounded-lg text-sm font-medium focus:outline-none focus:border-accent/50 text-muted-foreground cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
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
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === coord.id ? null : coord.id)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Action Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === coord.id && (
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
                              <button onClick={() => handleEdit(coord)} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-left">
                                <Edit className="w-4 h-4 text-muted-foreground" /> Edit Details
                              </button>
                              <button 
                                onClick={() => {
                                  updateCoordinator(coord.id, { status: coord.status === 'Active' ? 'Inactive' : 'Active' });
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-left"
                              >
                                <Power className="w-4 h-4 text-muted-foreground" /> 
                                {coord.status === 'Active' ? 'Disable Access' : 'Enable Access'}
                              </button>
                              <div className="h-px w-full bg-border/40 my-1"></div>
                              <button 
                                onClick={() => { deleteCoordinator(coord.id); setActiveDropdown(null); }}
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
                      <p className="text-xs max-w-sm mx-auto">Try adjusting your search or filters.</p>
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

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingId ? "Edit Coordinator" : "Add Coordinator"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded-md text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    required autoFocus
                    type="text" 
                    value={newCoordinator.name}
                    onChange={e => setNewCoordinator({...newCoordinator, name: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={newCoordinator.email}
                    onChange={e => setNewCoordinator({...newCoordinator, email: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select 
                    value={newCoordinator.role}
                    onChange={e => setNewCoordinator({...newCoordinator, role: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  >
                    <option value="Event Coordinator">Event Coordinator</option>
                    <option value="Lead Coordinator">Lead Coordinator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    value={newCoordinator.status}
                    onChange={e => setNewCoordinator({...newCoordinator, status: e.target.value as any})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium hover:bg-muted rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    {editingId ? "Save Changes" : "Add Coordinator"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
