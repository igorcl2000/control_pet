'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { NavBar } from '@/components/navbar';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Se não estiver carregando e não autenticado, redireciona para o login
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Exibe um estado de carregamento enquanto a autenticação está sendo verificada
    if (isLoading) {
        return (
            <section className="section">
                <div className="container has-text-centered">
                    <span className="icon is-large">
                        <i className="fas fa-spinner fa-pulse fa-2x"></i>
                    </span>
                    <p>Carregando informações do usuário...</p>
                </div>
            </section>
        );
    }

    // Se não estiver autenticado após o carregamento, significa que o redirecionamento está iminente
    if (!isAuthenticated) {
        return (
            <section className="section">
                <div className="container has-text-centered">
                    <p>Redirecionando para a página de login...</p>
                </div>
            </section>
        );
    }

    // Se estiver autenticado e o carregamento terminou, então 'user' e 'user.tipoUsuario' estão disponíveis.
    // Agora podemos renderizar a NavBar e o restante do conteúdo.
    return (
        <>
            <NavBar /> {/* A NavBar só é renderizada aqui, após a autenticação ser confirmada */}
            <section className="section">
                <div className="container">
                    <div className="level">
                        <div className="level-left">
                            <h1 className="title">Bem-vindo, {user?.nome}!</h1>
                        </div>
                        <div className="level-right">
                            <button onClick={logout} className="button is-danger">
                                Sair
                            </button>
                        </div>
                    </div>
                    <p className="subtitle">Você está logado como {user?.tipoUsuario}</p>

                    <div className="box">
                        <div className="buttons is-flex is-flex-direction-column">
                            {/* Renderiza botões específicos com base no tipo de usuário, se necessário */}
                            {user?.tipoUsuario === 'aluno' && (
                                <>
                                    <button
                                        className="button is-primary is-medium"
                                        onClick={() => router.push('/main/relatorios/relatorio-mensal-pet')}
                                    >
                                        Relatório Mensal PET
                                    </button>
                                    <button
                                        className="button is-info is-medium mt-3"
                                        onClick={() => router.push('/main/hist-relatorios')}
                                    >
                                        Histórico de Relatórios
                                    </button>
                                </>
                            )}
                            {user?.tipoUsuario === 'orientador' && (
                                <>
                                    <button
                                        className="button is-primary is-medium"
                                        onClick={() => router.push('/relatorios')}
                                    >
                                        Relatórios
                                    </button>
                                    <button
                                        className="button is-info is-medium mt-3"
                                        onClick={() => router.push('/alunos')}
                                    >
                                        Gerenciar Alunos
                                    </button>
                                </>
                            )}
                            <button
                                className="button is-link is-medium mt-3"
                                onClick={() => router.push('/main/perfil')}
                            >
                                Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}