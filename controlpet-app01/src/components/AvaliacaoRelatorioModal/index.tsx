// components/AvaliacaoRelatorioModal.tsx

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { AxiosError } from 'axios';

type AvaliacaoOpcoes = 'RUIM' | 'REGULAR' | 'BOM' | 'OTIMO' | '';

interface Relatorio {
    id: number;
    tipoRelatorio: string;
    dataInicial: string;
    dataFinal: string;
    dataEnvio?: string;
    resumoAtividades: string;
    comentarios?: string;
    alunoId: number;
    alunoNome: string;
    cargaHoraria?: AvaliacaoOpcoes;
    interesseAtividades?: AvaliacaoOpcoes;
    habilidadesDesenvolvidas?: AvaliacaoOpcoes;
    outrasInformacoes?: string;
}

interface AvaliacaoRelatorioData {
    relatorioId: number;
    cargaHoraria: AvaliacaoOpcoes;
    interesseAtividades: AvaliacaoOpcoes;
    habilidadesDesenvolvidas: AvaliacaoOpcoes;
    outrasInformacoes: string;
    id?: number;
}

interface AvaliacaoRelatorioModalProps {
    isActive: boolean;
    onClose: () => void;
    relatorio: Relatorio;
    onAvaliacaoConcluida: (relatorioAvaliado: Relatorio) => void;
}

export function AvaliacaoRelatorioModal({ isActive, onClose, relatorio, onAvaliacaoConcluida }: AvaliacaoRelatorioModalProps) {
    const [cargaHoraria, setCargaHoraria] = useState<AvaliacaoOpcoes>('');
    const [interesseAtividades, setInteresseAtividades] = useState<AvaliacaoOpcoes>('');
    const [habilidadesDesenvolvidas, setHabilidadesDesenvolvidas] = useState<AvaliacaoOpcoes>('');
    const [outrasInformacoes, setOutrasInformacoes] = useState('');
    const [avaliacaoId, setAvaliacaoId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const avaliacaoOptions: AvaliacaoOpcoes[] = ['RUIM', 'REGULAR', 'BOM', 'OTIMO'];

    useEffect(() => {
        const fetchAvaliacao = async () => {
            if (isActive && relatorio?.id) {
                setIsLoading(true);
                setError(null);
                setSuccessMessage(null);
                setAvaliacaoId(null);
                try {
                    const response = await api.get<AvaliacaoRelatorioData>(`/api/avaliacoes-relatorio/relatorio/${relatorio.id}`);
                    const avaliacao = response.data;
                    setAvaliacaoId(avaliacao.id || null);
                    setCargaHoraria(avaliacao.cargaHoraria || '');
                    setInteresseAtividades(avaliacao.interesseAtividades || '');
                    setHabilidadesDesenvolvidas(avaliacao.habilidadesDesenvolvidas || '');
                    setOutrasInformacoes(avaliacao.outrasInformacoes || '');
                } catch (err) {
                    console.error('Erro ao buscar avaliação existente:', err);
                    const axiosError = err as AxiosError<any>;
                    if (axiosError.response?.status === 404) {
                        setCargaHoraria('');
                        setInteresseAtividades('');
                        setHabilidadesDesenvolvidas('');
                        setOutrasInformacoes('');
                    } else {
                        setError(axiosError.response?.data?.message || 'Relatório não avaliado!');
                    }
                } finally {
                    setIsLoading(false);
                }
            } else if (!isActive) {
                setCargaHoraria('');
                setInteresseAtividades('');
                setHabilidadesDesenvolvidas('');
                setOutrasInformacoes('');
                setAvaliacaoId(null);
                setError(null);
                setSuccessMessage(null);
            }
        };

        fetchAvaliacao();
    }, [isActive, relatorio]);

    const handleSubmitAvaliacao = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const avaliacaoData: AvaliacaoRelatorioData = {
                relatorioId: relatorio.id,
                cargaHoraria: cargaHoraria,
                interesseAtividades: interesseAtividades,
                habilidadesDesenvolvidas: habilidadesDesenvolvidas,
                outrasInformacoes: outrasInformacoes,
            };

            let response;
            if (avaliacaoId) {
                response = await api.put(`/api/avaliacoes-relatorio/${avaliacaoId}`, avaliacaoData);
                setSuccessMessage('Avaliação atualizada com sucesso!');
            } else {
                response = await api.post('/api/avaliacoes-relatorio', avaliacaoData);
                setSuccessMessage('Avaliação salva com sucesso!');
            }

            onClose();
        } catch (err) {
            console.error('Erro ao salvar avaliação:', err);
            const axiosError = err as AxiosError<any>;
            setError(axiosError.response?.data?.message || 'Erro ao salvar avaliação.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isActive) return null;

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Avaliar Relatório de {relatorio.alunoNome}</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    {error && (
                        <div className="notification is-warning">
                            <button className="delete" onClick={() => setError(null)}></button>
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="notification is-success">
                            <button className="delete" onClick={() => setSuccessMessage(null)}></button>
                            {successMessage}
                        </div>
                    )}

                    {/* Campos de avaliação com Botões Selecionáveis */}
                    <div className="field">
                        <label className="label">Carga Horária</label>
                        <div className="control is-expanded"> {/* is-expanded para Bulma */}
                            <div className="buttons has-addons"> {/* has-addons e is-centered para Bulma */}
                                {avaliacaoOptions.map(option => (
                                    <button
                                        key={`cargaHoraria-${option}`}
                                        className={`button ${cargaHoraria === option ? 'is-primary' : ''}`}
                                        onClick={() => setCargaHoraria(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Interesse nas Atividades</label>
                        <div className="control is-expanded">
                            <div className="buttons has-addons">
                                {avaliacaoOptions.map(option => (
                                    <button
                                        key={`interesseAtividades-${option}`}
                                        className={`button ${interesseAtividades === option ? 'is-primary' : ''}`}
                                        onClick={() => setInteresseAtividades(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Habilidades Desenvolvidas</label>
                        <div className="control is-expanded">
                            <div className="buttons has-addons ">
                                {avaliacaoOptions.map(option => (
                                    <button
                                        key={`habilidadesDesenvolvidas-${option}`}
                                        className={`button ${habilidadesDesenvolvidas === option ? 'is-primary' : ''}`}
                                        onClick={() => setHabilidadesDesenvolvidas(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Outras Informações</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                placeholder="Adicione outras informações sobre a avaliação..."
                                value={outrasInformacoes}
                                onChange={(e) => setOutrasInformacoes(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    {/*
                    <div className="content mt-4">
                        <p><strong>Tipo de Relatório:</strong> {relatorio.tipoRelatorio}</p>
                        <p><strong>Período:</strong> {relatorio.dataInicial} a {relatorio.dataFinal}</p>
                        <p><strong>Resumo:</strong> {relatorio.resumoAtividades}</p>
                    </div>
                    */}
                </section>
                <footer className="modal-card-foot">
                    <button
                        className="button is-success mr-2"
                        onClick={handleSubmitAvaliacao}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Avaliação'}
                    </button>
                    <button className="button" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </button>
                </footer>
            </div>
        </div>
    );
}