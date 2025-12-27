import { UserProfile } from "./user";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "organizer";
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: "user" | "organizer";
  name: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "user" | "organizer";
  description?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}
