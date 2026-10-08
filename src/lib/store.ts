import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventStatus = 'Draft' | 'Active' | 'Completed';

export interface CertificateField {
  field: "participant_name" | "email" | "event_name" | "event_date" | "certificate_id" | "department" | "institution" | "register_number";
  x: number;
  y: number;
  font: string;
  fontSize: number;
  alignment: "left" | "center" | "right";
  color: string;
}

export interface Event {
  id: string;
  name: string;
  coordinator: string;
  date: string;
  status: EventStatus;
  participantsCount: number;
  templateDriveFileId?: string;
  templateUrl?: string;
  fields?: CertificateField[];
  emailSubject?: string;
  emailBody?: string;
}

export interface Coordinator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  event: string;
  status: 'Verified' | 'Pending' | 'Failed';
  date: string;
}

export type QueueStatus = 'Pending' | 'Generating' | 'Sending' | 'Completed' | 'Failed';

export interface EmailJob {
  id: string;
  eventId: string;
  participantName: string;
  participantEmail: string;
  status: QueueStatus;
  timestamp: string;
  error?: string;
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

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  description: string;
  userEmail: string;
}

interface AppState {
  events: Event[];
  coordinators: Coordinator[];
  participants: Participant[];
  certificatesGenerated: number;
  emailsSent: number;
  emailJobs: EmailJob[];
  settings: AppSettings;
  activityLogs: ActivityLog[];
  
  // Actions
  setEvents: (events: Event[]) => void;
  setEmailJobs: (jobs: EmailJob[]) => void;
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

  addParticipant: (participant: Omit<Participant, 'id'>) => void;
  addParticipants: (participants: Omit<Participant, 'id'>[]) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;

  incrementCertificates: (count: number) => void;
  incrementEmails: (count: number) => void;

  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

  // Auth State
  user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null; role?: string | null } | null;
  googleAccessToken?: string | null;
  setUser: (user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null; role?: string | null } | null) => void;
  setGoogleAccessToken: (token: string | null) => void;
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
          participantsCount: 150,
          emailSubject: 'Your Certificate for Annual Tech Symposium',
          emailBody: 'Hi {Participant Name},\n\nThank you for attending Annual Tech Symposium. Attached is your certificate of participation.\n\nBest,\nThe MATRIX Team'
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
      participants: [],
      certificatesGenerated: 0,
      emailsSent: 0,
      emailJobs: [],
      settings: {
        workspaceName: "Acme Corp Certification",
        supportEmail: "support@acmecorp.com",
        senderName: "Acme Certifications",
        smtpHost: "smtp.mailgun.org",
        smtpPort: "587",
        requireTls: true,
        twoFactorAuth: true,
        sessionTimeout: "30",
        emailAlerts: true,
        systemUpdates: true,
        logoUrl: "/logo.png"
      },
      activityLogs: [
        {
          id: '1',
          action: 'Logged in',
          timestamp: new Date().toISOString(),
          description: 'From IP 192.168.1.1 (Mac OS)',
          userEmail: 'alice@matrix.com'
        }
      ],

      setEvents: (events) => set({ events }),
      setEmailJobs: (jobs) => set({ emailJobs: jobs }),

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

      addParticipant: (p) => set((state) => ({
        participants: [{ ...p, id: `P-${Date.now()}-${Math.floor(Math.random() * 1000)}` }, ...state.participants]
      })),
      
      addParticipants: (newParticipants) => set((state) => ({
        participants: [...newParticipants.map((p, i) => ({ ...p, id: `P-${Date.now()}-${i}` })), ...state.participants]
      })),
      
      removeParticipant: (id) => set((state) => ({
        participants: state.participants.filter(p => p.id !== id)
      })),
      
      updateParticipant: (id, updates) => set((state) => ({
        participants: state.participants.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      incrementCertificates: (count) => set((state) => ({
        certificatesGenerated: state.certificatesGenerated + count
      })),
      
      incrementEmails: (count) => set((state) => ({
        emailsSent: state.emailsSent + count
      })),

      addActivityLog: (log) => set((state) => ({
        activityLogs: [{ ...log, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() }, ...state.activityLogs].slice(0, 50)
      })),

      user: null,
      googleAccessToken: null,
      setUser: (user) => set({ user }),
      setGoogleAccessToken: (token) => set({ googleAccessToken: token }),
      clearUser: () => set({ user: null, googleAccessToken: null })
    }),
    {
      name: 'matrix-storage', // unique name
    }
  )
);
