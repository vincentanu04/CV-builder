import { useGetAuthMeQuery, type AuthUser } from '@/api/client';
import {
  createContext,
  ReactNode,
  useContext,
} from 'react';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user = null, isLoading: loading } = useGetAuthMeQuery();

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

