import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAttributes } from "@/service/route/user/user";
// Tipos de usuário
export type UserRole = "admin" | "owner";

// Interface do usuário

// Interface do contexto
interface AuthContextProps {
  user: UserAttributes | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Dados de exemplo para usuários
const SAMPLE_USERS: UserAttributes[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@exemplo.com",
  },
  {
    id: "2",
    name: "Proprietário Exemplo",
    email: "proprietario@exemplo.com",
  },
];

// Criando o contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provedor do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserAttributes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar usuário no localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Verifica o usuário pelos dados de exemplo
      const foundUser = SAMPLE_USERS.find((u) => u.email === email);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
      } else {
        throw new Error("Credenciais inválidas");
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
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
