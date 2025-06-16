// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api, { loginUser, registerUser } from '../services/api';

type User = {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: string; // Garantir que este campo exista
};

type AuthContextType = {
    user: User | null;
    login: (email: string, senha: string) => Promise<void>;
    register: (nome: string, email: string, senha: string, tipo: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Indica se a verificação inicial de auth está acontecendo
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Função para verificar o status de autenticação (usada no useEffect e após login/logout)
    const checkAuthStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            // A instância 'api' já deve estar configurada para usar o token do localStorage
            const response = await api.get('/auth/me');
            setUser(response.data); // Certifique-se de que response.data tem { id, nome, email, tipoUsuario }
            setError(null);
        } catch (err) {
            console.error("Erro ao verificar autenticação ou token inválido:", err);
            setUser(null);
            localStorage.removeItem('token'); // Limpa token inválido/expirado
            // Opcional: redirecionar para login se o token for inválido
            // if (router.pathname !== '/login') { // Evita loop de redirecionamento
            //     router.push('/login');
            // }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Executa a verificação de autenticação na montagem do componente
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]); // Dependência para evitar recriação desnecessária

    const login = async (email: string, senha: string) => {
        try {
            setIsLoading(true);
            setError(null);
            // loginUser agora salva o token no localStorage E retorna os dados completos
            const userData = await loginUser({ email, senha });

            // Assume que 'userData' tem { id, nome, email, tipo }
            setUser({
                id: userData.id,
                nome: userData.nome,
                email: userData.email,
                tipoUsuario: userData.tipo, // Certifique-se que o campo é 'tipo' ou 'tipoUsuario'
            });

            // Redireciona APÓS o estado do usuário ser atualizado
            router.push('/'); // Ou a rota apropriada para o dashboard inicial
        } catch (err: any) {
            const errorMessage = err.message || 'Erro ao fazer login';
            setError(errorMessage);
            throw err; // Re-lança o erro para o componente de login
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (nome: string, email: string, senha: string, tipo: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await registerUser({ nome, email, senha, tipo });
            alert('Registro realizado com sucesso! Agora você pode fazer login.');
            router.push('/login');
        } catch (err: any) {
            const errorMessage = err.message || 'Erro ao registrar';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        try {
            // Opcional: chamar endpoint de logout na API para invalidar token no backend
            // api.post('/auth/logout');
        } catch (err) {
            console.error("Erro ao fazer logout na API (pode ser ignorado):", err);
        } finally {
            setUser(null);
            localStorage.removeItem('token'); // Garante que o token seja removido
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user, // Verdadeiro se user não for null
            isLoading, // Indica se a autenticação inicial está em andamento
            error
        }}>
            {children}
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