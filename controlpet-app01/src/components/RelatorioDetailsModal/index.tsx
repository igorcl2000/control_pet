// components/RelatorioDetailsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation'; // Importe o useRouter

interface RelatorioDetailsModalProps {
    isActive: boolean;
    onClose: () => void;
    relatorio: {
        id: number;
        tipoRelatorio: string;
        dataInicial: string;
        dataFinal: string;
        resumoAtividades: string;
        comentarios?: string;
        alunoId: number;
    };
    onRelatorioUpdated: (updatedRelatorio: any) => void;
    onRelatorioDeleted: (deletedId: number) => void;
}

export function RelatorioDetailsModal({
    isActive,
    onClose,
    relatorio,
    onRelatorioUpdated,
    onRelatorioDeleted
}: RelatorioDetailsModalProps) {
    const [originalData, setOriginalData] = useState(relatorio);
    const [editData, setEditData] = useState(relatorio);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter(); // Inicialize o useRouter

    useEffect(() => {
        setOriginalData(relatorio);
        setEditData(relatorio);
    }, [relatorio]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.put(`/api/relatorios/${relatorio.id}`, editData);
            onRelatorioUpdated(response.data);
            setOriginalData(response.data);
            setIsEditing(false);
            alert('Relatório atualizado com sucesso!');
        } catch (error: any) {
            console.error('Erro ao atualizar relatório:', error);
            const errorMessage = error.response?.data?.message ||
                'Erro ao atualizar relatório. Tente novamente.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este relatório?')) return;

        setIsLoading(true);
        setError(null);

        try {
            await api.delete(`/api/relatorios/${relatorio.id}`);
            onRelatorioDeleted(relatorio.id);
            onClose();
            alert('Relatório excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir relatório:', error);
            setError('Erro ao excluir relatório. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        // Redireciona para a página de geração de PDF, passando o ID do relatório
        router.push(`/relatorios/gerar?id=${relatorio.id}`);
        onClose(); // Opcional: fecha o modal após o clique
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">
                        {isEditing ? 'Editar Relatório' : 'Detalhes do Relatório'}
                    </p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>

                {/* Movemos o form para envolver apenas os campos editáveis */}
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <section className="modal-card-body">
                            {error && (
                                <div className="notification is-danger mb-4">
                                    <button className="delete" onClick={() => setError(null)}></button>
                                    {error}
                                </div>
                            )}

                            {/* Campos editáveis (mesmo conteúdo que antes) */}
                            <div className="field">
                                <label className="label">Tipo de Relatório</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            name="tipoRelatorio"
                                            value={editData.tipoRelatorio}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Relatório Mensal">Relatório Mensal</option>
                                            <option value="Relatório Trimestral">Relatório Trimestral</option>
                                            <option value="Relatório Semestral">Relatório Semestral</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Data Inicial</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="date"
                                                name="dataInicial"
                                                value={editData.dataInicial}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Data Final</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="date"
                                                name="dataFinal"
                                                value={editData.dataFinal}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Resumo de Atividades</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        name="resumoAtividades"
                                        value={editData.resumoAtividades}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Comentários</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        name="comentarios"
                                        value={editData.comentarios || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button
                                type="submit"
                                className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                                disabled={isLoading}
                            >
                                Salvar
                            </button>
                            <button
                                type="button"
                                className="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditData(originalData);
                                }}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                        </footer>
                    </form>
                ) : (
                    <>
                        <section className="modal-card-body">
                            {error && (
                                <div className="notification is-danger mb-4">
                                    <button className="delete" onClick={() => setError(null)}></button>
                                    {error}
                                </div>
                            )}

                            {/* Campos somente leitura */}
                            <div className="field">
                                <label className="label">Tipo de Relatório</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        value={originalData.tipoRelatorio}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Data Inicial</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={originalData.dataInicial}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Data Final</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                value={originalData.dataFinal}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Resumo de Atividades</label>
                                <div className="control">
                                    <div className="box" style={{ whiteSpace: 'pre-wrap' }}>
                                        {originalData.resumoAtividades}
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Comentários</label>
                                <div className="control">
                                    <div className="box" style={{ whiteSpace: 'pre-wrap' }}>
                                        {originalData.comentarios || 'Nenhum comentário'}
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.75rem' // Isso adiciona um espaçamento entre os botões
                        }}>
                            <button
                                type="button"
                                className="button is-info"
                                onClick={() => setIsEditing(true)}
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                className="button is-success"
                                onClick={handleDownloadPdf} // Chamará a função que redireciona
                            >
                                Baixar PDF
                            </button>
                            <button
                                type="button"
                                className="button is-danger"
                                onClick={handleDelete}
                            >
                                Excluir
                            </button>
                        </footer>
                    </>
                )}
            </div>
        </div>
    );
}