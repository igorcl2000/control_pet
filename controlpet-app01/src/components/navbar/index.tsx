'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from '../../../src/contexts/AuthContext';
import { useEffect, useState } from "react";

export function NavBar() {
    const pathname = usePathname();
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    const isActive = (href: string) => pathname === href;

    useEffect(() => {
        setIsMenuActive(false);
    }, [pathname]);

    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link href="/" className="navbar-item">
                    <img
                        src="/logo_pet.png"
                        alt="Logo PET"
                        style={{ maxHeight: '3.25rem' }}
                    />
                </Link>

                <button
                    className={`navbar-burger ${isMenuActive ? 'is-active' : ''}`}
                    aria-label="menu"
                    aria-expanded="false"
                    onClick={toggleMenu}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>

            <div className={`navbar-menu ${isMenuActive ? 'is-active' : ''}`}>
                <div className="navbar-start">

                    {/* Dropdown de Relatórios - VISÍVEL APENAS PARA ALUNOS */}
                    {user?.tipoUsuario === 'aluno' && (
                        <div className="navbar-item has-dropdown is-hoverable">
                            {/* O link principal do dropdown agora aponta para a criação do relatório */}
                            <Link href="/main/relatorios/relatorio-mensal-pet" className="navbar-link">
                                Criar Relatórios
                            </Link>

                            <div className="navbar-dropdown">
                                {/* O item do dropdown também aponta para a criação do relatório */}
                                <Link
                                    href="/main/relatorios/relatorio-mensal-pet"
                                    className={`navbar-item ${isActive('/main/relatorios/relatorio-mensal-pet') ? 'has-background-light has-text-grey-dark' : ''}`}
                                >
                                    Relatório Mensal PET
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Link para Relatórios (Orientador) ou Histórico de Relatórios (Aluno) */}
                    {user?.tipoUsuario === 'orientador' ? (
                        <Link
                            href="/relatorios"
                            className={`navbar-item ${isActive('/relatorios') ? 'has-background-light has-text-grey-dark' : ''}`}
                        >
                            Relatórios
                        </Link>
                    ) : (
                        <Link
                            href="/main/hist-relatorios"
                            className={`navbar-item ${isActive('/main/hist-relatorios') ? 'has-background-light has-text-grey-dark' : ''}`}
                        >
                            Histórico de Relatórios
                        </Link>
                    )}

                    {/* Link para Gerenciar Alunos - APENAS PARA ORIENTADORES */}
                    {user?.tipoUsuario === 'orientador' && (
                        <Link
                            href="/alunos"
                            className={`navbar-item ${isActive('/alunos') ? 'has-background-light has-text-grey-dark' : ''}`}
                        >
                            Alunos
                        </Link>
                    )}
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <Link
                                href="/main/perfil"
                                className={`button is-primary ${isActive('/main/perfil') ? 'is-light' : ''}`}
                            >
                                <strong>Perfil</strong>
                            </Link>
                            <button
                                className="button is-danger"
                                onClick={logout}>
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
