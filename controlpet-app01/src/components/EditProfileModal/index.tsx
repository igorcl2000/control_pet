'use client';

import { useState } from 'react';
import api from '@/services/api';

interface EditProfileModalProps {
    isActive: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
    initialData: {
        usuarioId: number;
        idade: number;
        periodoAno: string;
        editalIngresso: string;
        tipoEstudante: string;
        curso: string;
    };
    alunoId: number;
}

export function EditProfileModal({
    isActive,
    onClose,
    onSubmit,
    initialData,
    alunoId
}: EditProfileModalProps) {
    const [formData, setFormData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'idade' || name === 'usuarioId' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações
        if (!alunoId) {
            setError('ID do aluno não encontrado');
            return;
        }

        if (!formData.usuarioId) {
            setError('ID do usuário não encontrado');
            return;
        }

        if (formData.idade < 16 || formData.idade > 100) {
            setError('Idade deve estar entre 16 e 100 anos');
            return;
        }

        if (!formData.periodoAno.match(/^\d{4}\.\d$/)) {
            setError('Período/Ano deve estar no formato AAAA.P (ex: 2024.1)');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                usuarioId: formData.usuarioId,
                idade: formData.idade,
                periodoAno: formData.periodoAno,
                editalIngresso: formData.editalIngresso,
                tipoEstudante: formData.tipoEstudante,
                curso: formData.curso
            };

            console.log('Enviando para API:', {
                alunoId,
                payload
            });

            const response = await api.put(`/api/alunos/${alunoId}`, payload);

            onSubmit(response.data);
            onClose();

        } catch (error: any) {
            console.error('Erro completo:', error);

            let errorMessage = 'Erro ao atualizar perfil';
            if (error.response?.data) {
                errorMessage += `: ${JSON.stringify(error.response.data)}`;
            } else {
                errorMessage += `: ${error.message}`;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Editar Perfil</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <section className="modal-card-body">
                        {error && (
                            <div className="notification is-danger mb-4">
                                <button className="delete" onClick={() => setError(null)}></button>
                                {error}
                            </div>
                        )}

                        {/*
                        <div className="field">
                            <label className="label">ID do Usuário*</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    name="usuarioId"
                                    value={formData.usuarioId}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    disabled
                                />
                            </div>
                        </div> 
                        */}
                        <div className="field">
                            <label className="label">Idade*</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    name="idade"
                                    value={formData.idade}
                                    onChange={handleInputChange}
                                    required
                                    min="16"
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Período/Ano*</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="periodoAno"
                                    value={formData.periodoAno}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="2024.1"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Edital de Ingresso*</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="editalIngresso"
                                    value={formData.editalIngresso}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Tipo de Estudante*</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select
                                        name="tipoEstudante"
                                        value={formData.tipoEstudante}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="bolsista">Bolsista</option>
                                        <option value="voluntario">Voluntário</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Curso*</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select
                                        name="curso"
                                        value={formData.curso}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Ciência da Computação">Ciência da Computação</option>
                                        <option value="Engenharia de Software">Engenharia de Software</option>
                                        <option value="Análise de Desenvolvimento de Sistemas">Análise de Desenvolvimento de Sistemas</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button
                            type="submit"
                            className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                        <button
                            type="button"
                            className="button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}