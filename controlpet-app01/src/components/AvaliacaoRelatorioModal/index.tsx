// components/AvaliacaoRelatorioModal.tsx

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { AxiosError } from 'axios';

// 1. Atualizar AvaliacaoOpcoes para incluir 'ÓTIMO' (com acento)
type AvaliacaoOpcoes = 'RUIM' | 'REGULAR' | 'BOM' | 'OTIMO' | 'ÓTIMO' | '';

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
    // O tipo de envio para a API continua sendo 'OTIMO' (sem acento), então usamos AvaliacaoOpcoes sem 'ÓTIMO'
    cargaHoraria: 'RUIM' | 'REGULAR' | 'BOM' | 'OTIMO' | '';
    interesseAtividades: 'RUIM' | 'REGULAR' | 'BOM' | 'OTIMO' | '';
    habilidadesDesenvolvidas: 'RUIM' | 'REGULAR' | 'BOM' | 'OTIMO' | '';
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
    // Agora, os estados podem armazenar 'ÓTIMO'
    const [cargaHoraria, setCargaHoraria] = useState<AvaliacaoOpcoes>('');
    const [interesseAtividades, setInteresseAtividades] = useState<AvaliacaoOpcoes>('');
    const [habilidadesDesenvolvidas, setHabilidadesDesenvolvidas] = useState<AvaliacaoOpcoes>('');
    const [outrasInformacoes, setOutrasInformacoes] = useState('');
    const [avaliacaoId, setAvaliacaoId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // 2. Modificar avaliacaoOptions para exibir 'ÓTIMO'
    const avaliacaoOptionsParaExibicao: ('RUIM' | 'REGULAR' | 'BOM' | 'ÓTIMO')[] = ['RUIM', 'REGULAR', 'BOM', 'ÓTIMO'];

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

                    // 4. Ajustar useEffect (fetchAvaliacao): Se vier "OTIMO", converter para "ÓTIMO" para o estado local
                    setAvaliacaoId(avaliacao.id || null);
                    setCargaHoraria(avaliacao.cargaHoraria === 'OTIMO' ? 'ÓTIMO' : avaliacao.cargaHoraria || '');
                    setInteresseAtividades(avaliacao.interesseAtividades === 'OTIMO' ? 'ÓTIMO' : avaliacao.interesseAtividades || '');
                    setHabilidadesDesenvolvidas(avaliacao.habilidadesDesenvolvidas === 'OTIMO' ? 'ÓTIMO' : avaliacao.habilidadesDesenvolvidas || '');
                    setOutrasInformacoes(avaliacao.outrasInformacoes || '');
                } catch (err) {
                    console.error('Erro ao buscar avaliação existente:', err);
                    const axiosError = err as AxiosError<any>;
                    if (axiosError.response?.status === 404) {
                        // Resetar para vazio se não houver avaliação encontrada
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
                // Resetar estados quando o modal não está ativo
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

        // Função auxiliar para converter 'ÓTIMO' para 'OTIMO' antes de enviar
        const formatForApi = (value: AvaliacaoOpcoes): 'RUIM' | 'REGULAR' | 'BOM' | 'OTIMO' | '' => {
            if (value === 'ÓTIMO') {
                return 'OTIMO';
            }
            return value === 'RUIM' || value === 'REGULAR' || value === 'BOM' || value === 'OTIMO' ? value : '';
        };

        try {
            const avaliacaoData: AvaliacaoRelatorioData = {
                relatorioId: relatorio.id,
                // 3. Ajustar handleSubmitAvaliacao: Converter 'ÓTIMO' para 'OTIMO' antes de enviar
                cargaHoraria: formatForApi(cargaHoraria),
                interesseAtividades: formatForApi(interesseAtividades),
                habilidadesDesenvolvidas: formatForApi(habilidadesDesenvolvidas),
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

            // Opcional: Atualizar o relatório na lista pai se necessário.
            // Para isso, você precisaria decidir como a 'Relatorio' interface vai lidar com a avaliação:
            // Se Relatorio agora inclui as propriedades de avaliação, você pode passá-las.
            // Por exemplo:
            // onAvaliacaoConcluida({ ...relatorio, ...response.data }); // Assumindo que response.data inclui as propriedades de avaliação salvas
            onClose(); // Fechar o modal após o sucesso
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
                        <div className="control is-expanded">
                            <div className="buttons has-addons">
                                {avaliacaoOptionsParaExibicao.map(option => (
                                    <button
                                        key={`cargaHoraria-${option}`}
                                        // Compara com 'OTIMO' para o estado, se o option for 'ÓTIMO', mostra selecionado
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
                                {avaliacaoOptionsParaExibicao.map(option => (
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
                                {avaliacaoOptionsParaExibicao.map(option => (
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
                                maxLength={300}
                            ></textarea>
                        </div>
                    </div>
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