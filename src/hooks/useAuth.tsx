
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - Getting initial session...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('AuthProvider - Error getting session:', error);
      } else {
        console.log('AuthProvider - Initial session:', session?.user?.email);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider - Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider - Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider - Sign out error:', error);
        toast({
          title: "로그아웃 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('AuthProvider - Sign out successful');
        toast({
          title: "로그아웃 완료",
          description: "성공적으로 로그아웃되었습니다.",
        });
      }
    } catch (error) {
      console.error('AuthProvider - Unexpected sign out error:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  console.log('AuthProvider - Rendering with user:', user?.email, 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
