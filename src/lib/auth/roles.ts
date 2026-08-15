export type Role = "ADMIN" | "COORDINATOR";

export interface UserRecord {
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}
