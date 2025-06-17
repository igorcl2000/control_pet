'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { RelatorioDetailsModal } from '@/components/RelatorioDetailsModal';

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
}

export default function RelatoriosPage() {
    const router = useRouter();
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Altera selectedMonth para startDate e endDate
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedRelatorio, setSelectedRelatorio] = useState<Relatorio | null>(null);
    const [isDetailsModalActive, setIsDetailsModalActive] = useState(false);

    const handleRelatorioUpdated = (updatedRelatorio: Relatorio) => {
        setRelatorios(prev => prev.map(r =>
            r.id === updatedRelatorio.id ? updatedRelatorio : r
        ));
        setSelectedRelatorio(updatedRelatorio);
    };

    const handleRelatorioDeleted = (deletedId: number) => {
        setRelatorios(prev => prev.filter(r => r.id !== deletedId));
        setSelectedRelatorio(null);
    };

    useEffect(() => {
        const fetchRelatorios = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/api/relatorios');
                setRelatorios(response.data);
                setError(null);
            } catch (error) {
                if (error instanceof Error) {
                    setError(`Erro ao carregar relatórios: ${error.message}`);
                } else {
                    setError('Erro desconhecido ao carregar relatórios');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelatorios();
    }, []);

    const formatarData = (dataString: string): string => {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const filteredRelatorios = relatorios.filter(relatorio => {
        // MODIFICAÇÃO AQUI: Adiciona relatorio.alunoNome à busca
        const matchesSearch =
            relatorio.tipoRelatorio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            relatorio.resumoAtividades.toLowerCase().includes(searchTerm.toLowerCase()) ||
            relatorio.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()); // Adiciona busca por nome do aluno

        // Lógica de filtragem por período
        const relatorioDataInicial = new Date(relatorio.dataInicial + 'T00:00:00');
        const relatorioDataFinal = new Date(relatorio.dataFinal + 'T00:00:00');

        const filterStartDate = startDate ? new Date(startDate + 'T00:00:00') : null;
        const filterEndDate = endDate ? new Date(endDate + 'T00:00:00') : null;

        const matchesPeriod =
            (!filterStartDate || relatorioDataFinal >= filterStartDate) &&
            (!filterEndDate || relatorioDataInicial <= filterEndDate);

        return matchesSearch && matchesPeriod;
    });

    return (
        <>
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-10">
                            <h1 className="title">Todos os Relatórios</h1>

                            <div className="box mb-5">
                                <div className="field is-horizontal">
                                    <div className="field-body">
                                        <div className="field">
                                            <label className="label is-small mb-1">Nome do Aluno ou Conteúdo</label> {/* Altera o label para refletir a busca ampliada */}
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="text"
                                                    placeholder="Buscar por nome, tipo ou conteúdo..." // Altera o placeholder
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <span className="icon is-left">
                                                    <i className="fas fa-search"></i>
                                                </span>
                                            </div>
                                        </div>
                                        {/* Campos para filtro de período (Data Inicial e Data Final) */}
                                        <div className="field">
                                            <label className="label is-small mb-1">Data Inicial:</label>
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                />
                                                <span className="icon is-left">
                                                    <i className="fas fa-calendar-alt"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label is-small mb-1">Data Final:</label>
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                />
                                                <span className="icon is-left">
                                                    <i className="fas fa-calendar-alt"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="has-text-centered">
                                    <span className="icon is-large">
                                        <i className="fas fa-spinner fa-pulse fa-2x"></i>
                                    </span>
                                    <p>Carregando relatórios...</p>
                                </div>
                            ) : error ? (
                                <div className="notification is-danger">
                                    <button
                                        className="delete"
                                        onClick={() => setError(null)}
                                    ></button>
                                    {error}
                                </div>
                            ) : filteredRelatorios.length === 0 ? (
                                <div className="notification is-warning">
                                    Nenhum relatório encontrado para os critérios selecionados.
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <span className="tag is-info">
                                            {filteredRelatorios.length} {filteredRelatorios.length === 1 ? 'relatório encontrado' : 'relatórios encontrados'}
                                        </span>
                                    </div>
                                    <div className="table-container">
                                        <table className="table is-fullwidth is-striped is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th>Aluno</th>
                                                    <th>Tipo</th>
                                                    <th>Período</th>
                                                    <th>Resumo</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRelatorios.map((relatorio) => (
                                                    <tr key={relatorio.id}>
                                                        <td>{relatorio.alunoNome}</td>
                                                        <td>{relatorio.tipoRelatorio}</td>
                                                        <td>
                                                            {formatarData(relatorio.dataInicial)} a{' '}
                                                            {formatarData(relatorio.dataFinal)}
                                                        </td>
                                                        <td>
                                                            <div className="content">
                                                                <p className="is-clipped" style={{
                                                                    maxWidth: '300px',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                    {relatorio.resumoAtividades}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="button is-small is-info"
                                                                onClick={() => {
                                                                    setSelectedRelatorio(relatorio);
                                                                    setIsDetailsModalActive(true);
                                                                }}
                                                            >
                                                                Detalhes
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {selectedRelatorio && (
                                <RelatorioDetailsModal
                                    isActive={isDetailsModalActive}
                                    onClose={() => setIsDetailsModalActive(false)}
                                    relatorio={selectedRelatorio}
                                    onRelatorioUpdated={handleRelatorioUpdated}
                                    onRelatorioDeleted={handleRelatorioDeleted}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}