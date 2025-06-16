'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

type FormData = {
    nome: string;
    email: string;
    senha: string;
    tipo: string;
};

export default function RegisterPage() {
    const { register, isLoading: authLoading, error: authError } = useAuth();
    const router = useRouter();
    const {
        register: registerForm,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<FormData>({
        mode: 'onBlur',
        defaultValues: {
            tipo: 'ALUNO'
        }
    });

    const [localError, setLocalError] = useState<string | null>(null);
    const password = watch('senha');

    const onSubmit = async (data: FormData) => {
        try {
            setLocalError(null);
            await register(data.nome, data.email, data.senha, data.tipo);
            router.push('/login');
        } catch (err) {
            setLocalError(
                err instanceof Error ? err.message : 'Erro ao cadastrar usuário'
            );
        }
    };

    const errorMessage = localError || authError;
    const isLoading = isSubmitting || authLoading;

    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-4-widescreen">
                            <form onSubmit={handleSubmit(onSubmit)} className="box">
                                <h1 className="title has-text-centered mb-5">Cadastro</h1>

                                {errorMessage && (
                                    <div className="notification is-danger is-light mb-4">
                                        <button
                                            className="delete"
                                            onClick={() => setLocalError(null)}
                                        />
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="field">
                                    <label className="label">Nome Completo</label>
                                    <div className="control has-icons-left">
                                        <input
                                            {...registerForm('nome', {
                                                required: 'Nome é obrigatório',
                                                minLength: {
                                                    value: 3,
                                                    message: 'Nome deve ter pelo menos 3 caracteres'
                                                }
                                            })}
                                            className={`input ${errors.nome ? 'is-danger' : ''}`}
                                            type="text"
                                            placeholder="João Silva"
                                            disabled={isLoading}
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </div>
                                    {errors.nome && (
                                        <p className="help is-danger">{errors.nome.message}</p>
                                    )}
                                </div>

                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control has-icons-left">
                                        <input
                                            {...registerForm('email', {
                                                required: 'Email é obrigatório',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Digite um email válido'
                                                }
                                            })}
                                            className={`input ${errors.email ? 'is-danger' : ''}`}
                                            type="email"
                                            placeholder="seu@email.com"
                                            disabled={isLoading}
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                    </div>
                                    {errors.email && (
                                        <p className="help is-danger">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="field">
                                    <label className="label">Senha</label>
                                    <div className="control has-icons-left">
                                        <input
                                            {...registerForm('senha', {
                                                required: 'Senha é obrigatória',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Senha deve ter pelo menos 6 caracteres'
                                                },
                                                validate: (value) =>
                                                    /[A-Z]/.test(value) || 'Deve conter pelo menos uma letra maiúscula'
                                            })}
                                            className={`input ${errors.senha ? 'is-danger' : ''}`}
                                            type="password"
                                            placeholder="••••••"
                                            disabled={isLoading}
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    </div>
                                    {errors.senha && (
                                        <p className="help is-danger">{errors.senha.message}</p>
                                    )}
                                </div>
                                {/*
                                <div className="field">
                                    <label className="label">Tipo de Usuário</label>
                                    <div className="control has-icons-left">
                                        <div className={`select is-fullwidth ${errors.tipo ? 'is-danger' : ''}`}>
                                            <select
                                                {...registerForm('tipo', {
                                                    required: 'Selecione um tipo de usuário'
                                                })}
                                                disabled={isLoading}
                                            >
                                                <option value="ALUNO">Aluno</option>
                                                <option value="ORIENTADOR">Orientador</option>
                                            </select>
                                        </div>
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user-tag"></i>
                                        </span>
                                    </div>
                                    {errors.tipo && (
                                        <p className="help is-danger">{errors.tipo.message}</p>
                                    )}
                                </div>
                                
                                */}

                                <div className="field mt-5">
                                    <button
                                        type="submit"
                                        className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                                        disabled={isLoading}
                                    >
                                        Cadastrar
                                    </button>
                                </div>

                                <div className="has-text-centered mt-4">
                                    <Link href="/login" className="is-link">
                                        Já tem uma conta? <strong>Faça login</strong>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}