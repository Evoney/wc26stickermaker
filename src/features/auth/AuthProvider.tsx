import {
  type User,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { auth, authPersistence, firebaseConfigError, googleProvider } from './firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configError: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || firebaseConfigError) {
      setLoading(false);
      return;
    }

    let unsubscribed = false;
    let authUnsubscribe: (() => void) | undefined;

    void setPersistence(auth, authPersistence)
      .catch((error) => {
        console.error('Falha ao configurar persistência do Firebase Auth.', error);
      })
      .finally(() => {
        authUnsubscribe = onAuthStateChanged(auth, (nextUser) => {
          if (unsubscribed) {
            return;
          }

          setUser(nextUser);
          setLoading(false);
        });

        if (unsubscribed) {
          authUnsubscribe?.();
        }
      });

    return () => {
      unsubscribed = true;
      authUnsubscribe?.();
    };
  }, []);

  const loginWithGoogle = async () => {
    if (!auth || firebaseConfigError) {
      throw new Error(firebaseConfigError ?? 'Firebase Auth indisponível.');
    }

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const errorCode = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

      if (
        errorCode === 'auth/popup-blocked' ||
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request'
      ) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configError: firebaseConfigError,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
