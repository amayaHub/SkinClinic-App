import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { RequiredProfileForm } from '../components/RequiredProfileForm';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showProfileForm: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  closeProfileForm: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const redirectTo = window.location.origin.includes('localhost')
      ? window.location.origin
      : window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: false
      }
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  // Handle user data synchronization
  useEffect(() => {
    if (user) {
      const syncUserProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        // Show profile form if required fields are missing
        if (!profile?.full_name || !profile?.phone) {
          setShowProfileForm(true);
        } else {
          setShowProfileForm(false);
        }

        // Update profile with Google data if available
        if (user.app_metadata.provider === 'google' && (user.user_metadata.full_name || user.user_metadata.name)) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata.full_name || user.user_metadata.name,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (error) {
            console.error('Error syncing user profile:', error);
          }
        }
      };

      syncUserProfile();
    }
  }, [user]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  const closeProfileForm = () => {
    setShowProfileForm(false);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      showProfileForm,
      signIn, 
      signInWithGoogle, 
      signUp, 
      signOut,
      closeProfileForm,
      resetPassword
    }}>
      {children}
      {showProfileForm && <RequiredProfileForm onClose={closeProfileForm} />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}