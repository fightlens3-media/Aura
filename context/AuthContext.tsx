
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; requiresOTP: boolean; error?: string }>;
  signup: (userData: Partial<User>) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  continueWithSocial: (provider: 'google' | 'card') => Promise<{ email: string | null; requiresOTP: boolean }>;
  verifyOTP: (code: string, email: string, trustDevice: boolean) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  lastDispatchedCode: string | null;
  clearDispatchedCode: () => void;
  resendOTP: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * THE AUTHORIZED MASTER PROFILE: Robert J. White
 * Identity details as per user specification.
 */
const MOCK_MASTER_USER: User = {
  id: 'master-robert',
  name: 'Robert J. White',
  email: 'RobertJWhite@dayrep.com',
  phone: '937-604-1246',
  address: '3171 Harter Street, Dayton, OH 45402',
  avatar: 'https://i.pravatar.cc/150?u=RobertJWhite@dayrep.com',
  isAddressVerified: true,
  rewardPoints: 75000,
  password: 'quoong9Aox',
  maidenName: 'Gunn',
  ssn: '297-11-XXXX',
  geo: '39.792167, -84.158445',
  birthday: 'March 17, 1988',
  age: '37 years old',
  zodiac: 'Pisces',
  username: 'Wayearty'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDispatchedCode, setLastDispatchedCode] = useState<string | null>(null);

  useEffect(() => {
    const initRegistry = () => {
      const savedSession = localStorage.getItem('aura_session');
      if (savedSession === MOCK_MASTER_USER.id) {
        setCurrentUser(MOCK_MASTER_USER);
      }
      setIsLoading(false);
    };
    initRegistry();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; requiresOTP: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== MOCK_MASTER_USER.email.toLowerCase()) {
      setIsLoading(false);
      return { success: false, requiresOTP: false, error: 'UNAUTHORIZED NODE IDENTIFIER.' };
    }

    if (MOCK_MASTER_USER.password !== password) {
      setIsLoading(false);
      return { success: false, requiresOTP: false, error: 'INVALID ACCESS KEY.' };
    }

    // Direct Login for the master identity to ensure "it works" instantly
    setCurrentUser(MOCK_MASTER_USER);
    localStorage.setItem('aura_session', MOCK_MASTER_USER.id);
    setIsLoading(false);
    return { success: true, requiresOTP: false };
  };

  const verifyOTP = async (code: string, email: string, trustDevice: boolean): Promise<boolean> => {
    // Legacy support for OTP step if needed later
    return true;
  };

  const signup = async () => false;

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const logout = () => {
    localStorage.removeItem('aura_session');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, login, signup, updateUser, verifyOTP, logout, isLoading,
      lastDispatchedCode, clearDispatchedCode: () => setLastDispatchedCode(null),
      continueWithSocial: async () => ({ email: null, requiresOTP: false }),
      resendOTP: async () => {}
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
