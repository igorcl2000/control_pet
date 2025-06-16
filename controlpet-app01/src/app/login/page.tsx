'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

type FormData = {
    email: string;
    senha: string;
};

export default function LoginPage() {
    const { login, isLoading: authLoading, error: authError } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        mode: 'onBlur'
    });

    const [localError, setLocalError] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        try {
            setLocalError(null);
            await login(data.email, data.senha);
        } catch (err) {
            setLocalError(
                err instanceof Error ? err.message : 'Credenciais inválidas'
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
                        <div className="column is-4-tablet is-4-desktop is-4-widescreen">
                            <form onSubmit={handleSubmit(onSubmit)} className="box">
                                <h1 className="title has-text-centered mb-5">Control PET</h1>
                                <h1 className="title has-text-centered mb-5">Login</h1>

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
                                    <label className="label">Email</label>
                                    <div className="control has-icons-left">
                                        <input
                                            {...register('email', {
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
                                            {...register('senha', {
                                                required: 'Senha é obrigatória',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Senha deve ter pelo menos 6 caracteres'
                                                }
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

                                <div className="field mt-5">
                                    <button
                                        type="submit"
                                        className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                                        disabled={isLoading}
                                    >
                                        Entrar
                                    </button>
                                </div>

                                <div className="has-text-centered mt-4">
                                    <Link href="/register" className="is-link">
                                        Não tem uma conta? <strong>Cadastre-se</strong>
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