import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventStatus = 'Draft' | 'Active' | 'Completed';

export interface Event {
  id: string;
  name: string;
  coordinator: string;
  date: string;
  status: EventStatus;
  participantsCount: number;
}

export interface Coordinator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export type QueueStatus = 'Pending' | 'Generating' | 'Sending' | 'Completed' | 'Failed';

export interface EmailJob {
  id: string;
  eventId: string;
  participantName: string;
  participantEmail: string;
  status: QueueStatus;
  timestamp: string;
}

export interface AppSettings {
  workspaceName: string;
  supportEmail: string;
  senderName: string;
  smtpHost: string;
  smtpPort: string;
  requireTls: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: string;
  emailAlerts: boolean;
  systemUpdates: boolean;
  logoUrl: string;
}

interface AppState {
  events: Event[];
  coordinators: Coordinator[];
  certificatesGenerated: number;
  emailsSent: number;
  emailJobs: EmailJob[];
  settings: AppSettings;
  
  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  addEmailJob: (job: Omit<EmailJob, 'id'>) => string;
  updateEmailJob: (id: string, updates: Partial<EmailJob>) => void;
  clearEmailJobs: () => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  addCoordinator: (coordinator: Omit<Coordinator, 'id'>) => void;
  updateCoordinator: (id: string, coordinator: Partial<Coordinator>) => void;
  deleteCoordinator: (id: string) => void;

  incrementCertificates: (count: number) => void;
  incrementEmails: (count: number) => void;

  // Auth State
  user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null } | null;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      events: [
        {
          id: '1',
          name: 'Annual Tech Symposium',
          coordinator: 'Alice Johnson',
          date: '2026-09-15',
          status: 'Active',
          participantsCount: 150
        }
      ],
      coordinators: [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@matrix.com',
          role: 'Lead Coordinator',
          status: 'Active'
        }
      ],
      certificatesGenerated: 1250,
      emailsSent: 1200,
      emailJobs: [],
      settings: {
        workspaceName: "Acme Corp Certification",
        supportEmail: "support@acmecorp.com",
        senderName: "Acme Certifications",
        smtpHost: "smtp.mailgun.org",
        smtpPort: "587",
        requireTls: true,
        twoFactorAuth: false,
        sessionTimeout: "30",
        emailAlerts: true,
        systemUpdates: false,
        logoUrl: "/logo.png"
      },

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      addEmailJob: (job) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          emailJobs: [...state.emailJobs, { ...job, id }]
        }));
        return id;
      },
      
      updateEmailJob: (id, updates) => set((state) => ({
        emailJobs: state.emailJobs.map(job => job.id === id ? { ...job, ...updates } : job)
      })),

      clearEmailJobs: () => set({ emailJobs: [] }),

      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: Math.random().toString(36).substr(2, 9) }]
      })),
      
      updateEvent: (id, updatedEvent) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updatedEvent } : e)
      })),
      
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),

      addCoordinator: (coordinator) => set((state) => ({
        coordinators: [...state.coordinators, { ...coordinator, id: Math.random().toString(36).substr(2, 9) }]
      })),
      
      updateCoordinator: (id, updatedCoordinator) => set((state) => ({
        coordinators: state.coordinators.map(c => c.id === id ? { ...c, ...updatedCoordinator } : c)
      })),
      
      deleteCoordinator: (id) => set((state) => ({
        coordinators: state.coordinators.filter(c => c.id !== id)
      })),

      incrementCertificates: (count) => set((state) => ({
        certificatesGenerated: state.certificatesGenerated + count
      })),
      
      incrementEmails: (count) => set((state) => ({
        emailsSent: state.emailsSent + count
      })),

      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null })
    }),
    {
      name: 'matrix-storage', // unique name
    }
  )
);
