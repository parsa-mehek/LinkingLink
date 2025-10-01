import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface Profile { id: string; name?: string | null; }

interface AuthContextState {
  user: User | null;            // Supabase user object
  currentUser: User | null;     // Alias for clarity in consuming components
  setCurrentUser: (u: User | null) => void; // Manual override (rarely needed; mainly for optimistic UI)
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any } | void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any } | void>;
  updatePassword: (newPassword: string) => Promise<{ error: any } | void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const { data: prof } = await supabase.from('profiles').select('id,name').eq('id', data.session.user.id).single();
        if (prof) setProfile(prof);
      }
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        const { data: prof } = await supabase.from('profiles').select('id,name').eq('id', sess.user.id).single();
        setProfile(prof || null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Persist session snapshot (lightweight) in localStorage for auxiliary uses (NOT required by Supabase SDK which has its own persistence)
  useEffect(() => {
    if (session) {
      try { localStorage.setItem('ll_session', JSON.stringify({ access_token: session.access_token, user: session.user.id })); } catch {}
    } else {
      try { localStorage.removeItem('ll_session'); } catch {}
    }
  }, [session]);

  const signIn: AuthContextState['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
  };

  const signUp: AuthContextState['signUp'] = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    if (data.user && name) {
      await supabase.from('profiles').upsert({ id: data.user.id, name });
      setProfile({ id: data.user.id, name });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    try { localStorage.removeItem('ll_session'); } catch {}
  };

  const requestPasswordReset: AuthContextState['requestPasswordReset'] = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    if (error) return { error };
  };

  const updatePassword: AuthContextState['updatePassword'] = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error };
  };

  const setCurrentUser = (u: User | null) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, currentUser: user, setCurrentUser, session, profile, loading, signIn, signUp, signOut, requestPasswordReset, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
