'use client';

import { useState } from 'react';

interface ChangePasswordModalProps {
    isActive: boolean;
    onClose: () => void;
    onSubmit: (passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => void;
}

export function ChangePasswordModal({ isActive, onClose, onSubmit }: ChangePasswordModalProps) {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(passwordData);
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Redefinir Senha</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <section className="modal-card-body">
                        <div className="field">
                            <label className="label">Senha Atual</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Nova Senha</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Confirmar Nova Senha</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button type="submit" className="button is-success mr-2">Alterar Senha</button>
                        <button type="button" className="button" onClick={onClose}>Cancelar</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}