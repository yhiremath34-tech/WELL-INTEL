import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types/user';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
}

const DEMO_USER_PROFILE: UserProfile = {
  id: 'usr-demo-01',
  email: 'citizen.scout@wellintel.org',
  full_name: 'Aditi Hegde',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'user',
  created_at: '2024-01-10T10:00:00Z',
  updated_at: '2026-09-20T12:00:00Z',
};

const DEMO_ADMIN_PROFILE: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin.director@wellintel.gov.in',
  full_name: 'Dr. Ramesh Bhatt (Admin)',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2026-09-21T09:00:00Z',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'user',
  isLoading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  loginAsDemoUser: () => {},
  loginAsDemoAdmin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('wellintel_auth_user');
      return saved ? JSON.parse(saved) : DEMO_USER_PROFILE; // pre-load demo user for smooth first exploration
    } catch {
      return DEMO_USER_PROFILE;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Groundwater Observer',
            avatar_url: session.user.user_metadata?.avatar_url,
            role: (session.user.user_metadata?.role as UserRole) || 'user',
            created_at: session.user.created_at,
            updated_at: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem('wellintel_auth_user', JSON.stringify(profile));
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Groundwater Observer',
            avatar_url: session.user.user_metadata?.avatar_url,
            role: (session.user.user_metadata?.role as UserRole) || 'user',
            created_at: session.user.created_at,
            updated_at: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem('wellintel_auth_user', JSON.stringify(profile));
        } else {
          // If Supabase signed out, don't clear demo unless deliberate
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) return { error: error.message };
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || 'Hydrology Specialist',
            avatar_url: data.user.user_metadata?.avatar_url,
            role: (data.user.user_metadata?.role as UserRole) || 'user',
            created_at: data.user.created_at,
            updated_at: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem('wellintel_auth_user', JSON.stringify(profile));
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Authentication failed' };
      }
    }

    // Local authentication fallback
    const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(profile);
    localStorage.setItem('wellintel_auth_user', JSON.stringify(profile));
    return {};
  };

  const signUp = async (email: string, pass: string, name: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: name, role: 'user' },
          },
        });
        if (error) return { error: error.message };
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: name,
            role: 'user',
            created_at: data.user.created_at,
            updated_at: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem('wellintel_auth_user', JSON.stringify(profile));
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Registration failed' };
      }
    }

    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: name,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(profile);
    localStorage.setItem('wellintel_auth_user', JSON.stringify(profile));
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('wellintel_auth_user');
  };

  const loginAsDemoUser = () => {
    setUser(DEMO_USER_PROFILE);
    localStorage.setItem('wellintel_auth_user', JSON.stringify(DEMO_USER_PROFILE));
  };

  const loginAsDemoAdmin = () => {
    setUser(DEMO_ADMIN_PROFILE);
    localStorage.setItem('wellintel_auth_user', JSON.stringify(DEMO_ADMIN_PROFILE));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'user',
        isLoading,
        signIn,
        signUp,
        signOut,
        loginAsDemoUser,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
