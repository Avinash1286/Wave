import { User, LoginData, SignupData } from "@/types/auth";
import { toast } from "sonner";

const AUTH_STORAGE_KEY = 'voicewave_auth';
const USERS_STORAGE_KEY = 'voicewave_users';

// Helper to hash password (in a real app, this would be done server-side)
const hashPassword = (password: string): string => {
  return btoa(password); // Simple base64 encoding for demo purposes
};

// Initialize users in localStorage if not exists
export const initializeAuthStorage = (): void => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  if (!users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!auth) return null;
    return JSON.parse(auth).user;
  } catch {
    return null;
  }
};

// Login user
export const loginUser = async ({ email, password }: LoginData): Promise<User> => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const hashedPassword = hashPassword(password);
  
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('User not found');
  }
  
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    user,
    token: hashedPassword // In a real app, this would be a JWT token
  }));
  
  return user;
};

// Sign up new user
export const signupUser = async ({ email, password, username }: SignupData): Promise<User> => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  
  if (users.some(u => u.email === email)) {
    throw new Error('Email already exists');
  }
  
  if (users.some(u => u.username === username)) {
    throw new Error('Username already exists');
  }
  
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    username,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // Auto login after signup
  await loginUser({ email, password });
  
  return newUser;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};