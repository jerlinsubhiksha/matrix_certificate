"use client";

import React, { useState, useEffect } from "react";
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
  UsersRound,
  X,
  Loader2
} from "lucide-react";
import { collection, query, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import toast from "react-hot-toast";

interface UserData {
  uid: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Timestamp;
}

export default function CoordinatorsPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add User Form State
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("coordinator");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedUsers: UserData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push(doc.data() as UserData);
      });
      setUsers(fetchedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load coordinators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail || !addRole) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      const token = await currentUser.getIdToken();
      
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: addName,
          email: addEmail,
          role: addRole
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      toast.success("Coordinator added successfully! Password reset email logic simulated.");
      setIsAddModalOpen(false);
      setAddName("");
      setAddEmail("");
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coordinators</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system access and roles for your event coordinators.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
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
      <div className="bg-card border border-border/60 rounded-xl overflow-visible relative shadow-sm min-h-[400px]">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10 rounded-xl">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        ) : null}
        
        <div className="overflow-x-auto">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((coord) => (
                  <tr key={coord.uid} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                        {coord.name.charAt(0)}
                      </div>
                      {coord.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{coord.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium border border-border/50 capitalize">
                        {coord.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${coord.status === 'active' ? 'text-green-500' : 'text-muted-foreground capitalize'}`}>
                        <span className={`w-2 h-2 rounded-full ${coord.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        {coord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === coord.uid ? null : coord.uid)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Action Dropdown */}
                      {activeDropdown === coord.uid && (
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
                              {coord.status === 'active' ? 'Disable Access' : 'Enable Access'}
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
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <UsersRound className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="font-medium text-sm text-foreground mb-1">No coordinators found</p>
                      <p className="text-xs max-w-sm mx-auto">You haven't added any event coordinators to the system yet.</p>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
                      >
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
          <span className="text-xs text-muted-foreground">Showing {filteredUsers.length} coordinators</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-md bg-accent text-white text-xs font-semibold flex items-center justify-center">1</button>
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground border border-transparent hover:border-border/50 transition-all disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border/60 overflow-hidden animate-in zoom-in-95">
             <div className="flex items-center justify-between p-6 border-b border-border/40 bg-muted/20">
               <h3 className="font-semibold text-lg">Add New Coordinator</h3>
               <button 
                 onClick={() => setIsAddModalOpen(false)}
                 className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             <form onSubmit={handleAddUser} className="p-6 space-y-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Full Name</label>
                 <input 
                   type="text" 
                   value={addName}
                   onChange={(e) => setAddName(e.target.value)}
                   className="w-full p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors text-sm"
                   placeholder="Jane Doe"
                   required
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Email Address</label>
                 <input 
                   type="email" 
                   value={addEmail}
                   onChange={(e) => setAddEmail(e.target.value)}
                   className="w-full p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors text-sm"
                   placeholder="jane@example.com"
                   required
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Assign Role</label>
                 <select 
                   value={addRole}
                   onChange={(e) => setAddRole(e.target.value)}
                   className="w-full p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors text-sm"
                 >
                   <option value="admin">Admin</option>
                   <option value="coordinator">Coordinator</option>
                   <option value="teacher">Teacher</option>
                   <option value="student">Student</option>
                 </select>
               </div>
               <div className="pt-4 flex justify-end gap-3">
                 <button 
                   type="button"
                   onClick={() => setIsAddModalOpen(false)}
                   className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
                 </button>
               </div>
             </form>
           </div>
        </div>
      )}
      
    </div>
  );
}
