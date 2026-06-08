import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import {
  UserProfile,
  UserPhoto,
  ProfileUpdate,
  fetchProfile,
  register,
  login,
  logout,
  updateProfile as updateProfileFn,
  uploadPhoto as uploadPhotoFn,
  deletePhoto as deletePhotoFn,
  reorderPhotos as reorderPhotosFn,
} from '@/lib/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserProfile>;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateProfile: (patch: ProfileUpdate) => Promise<UserProfile>;
  uploadPhoto: (file: File, displayOrder: number) => Promise<UserPhoto>;
  deletePhoto: (photo: UserPhoto) => Promise<void>;
  reorderPhotos: (orderedIds: string[]) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]     = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh).
    // IMPORTANT: the callback must be synchronous — Supabase JS awaits all
    // subscribers before resolving signInWithPassword/signUp. Doing async
    // work (fetchProfile) inside the callback would deadlock the auth call.
    // We defer async work with setTimeout so the callback returns immediately.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setTimeout(() => setUser(null), 0);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id);
            setUser(profile);
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<UserProfile> => {
    const profile = await register(email, password);
    setUser(profile);
    return profile;
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<UserProfile> => {
    const profile = await login(email, password);
    setUser(profile);
    return profile;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch: ProfileUpdate): Promise<UserProfile> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await updateProfileFn(user.id, patch);
    setUser(updated);
    return updated;
  }, [user]);

  const uploadPhoto = useCallback(async (file: File, displayOrder: number): Promise<UserPhoto> => {
    if (!user) throw new Error('Not authenticated');
    const photo = await uploadPhotoFn(user.id, file, displayOrder);
    // Refresh profile to reflect new photo list
    const updated = await fetchProfile(user.id);
    if (updated) setUser(updated);
    return photo;
  }, [user]);

  const deletePhoto = useCallback(async (photo: UserPhoto): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await deletePhotoFn(photo);
    const updated = await fetchProfile(user.id);
    if (updated) setUser(updated);
  }, [user]);

  const reorderPhotos = useCallback(async (orderedIds: string[]): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await reorderPhotosFn(user.id, orderedIds);
    const updated = await fetchProfile(user.id);
    if (updated) setUser(updated);
  }, [user]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!user) return;
    const updated = await fetchProfile(user.id);
    if (updated) setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        uploadPhoto,
        deletePhoto,
        reorderPhotos,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
