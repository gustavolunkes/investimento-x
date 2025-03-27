
import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos de usuário
export type UserRole = 'admin' | 'owner';

// Interface do usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Interface do contexto
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

// Dados de exemplo para usuários
const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@exemplo.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Proprietário Exemplo',
    email: 'proprietario@exemplo.com',
    role: 'owner',
  },
];

// Criando o contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar usuário no localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Função de login (simulada)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simula uma requisição de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verifica o usuário pelos dados de exemplo
      const foundUser = SAMPLE_USERS.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
