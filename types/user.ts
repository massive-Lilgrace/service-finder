// types/user.ts

export type UserRole = "customer" | "provider" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}