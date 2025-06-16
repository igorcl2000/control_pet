'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/navbar';
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

export default function HistRelatorios() {
    const router = useRouter();
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Substituído selectedMonth por startDate e endDate para o filtro de período
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

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
        const fetchUserAndRelatorios = async () => {
            try {
                setIsLoading(true);

                // 1. Primeiro busca o usuário logado
                const userResponse = await api.get('/auth/me');
                setCurrentUserId(userResponse.data.id);

                // 2. Busca todos os alunos para encontrar o correspondente ao usuário
                const alunosResponse = await api.get('/api/alunos');
                const alunoDoUsuario = alunosResponse.data.find(
                    (aluno: any) => aluno.usuario.id === userResponse.data.id
                );

                if (!alunoDoUsuario) {
                    setRelatorios([]);
                    return;
                }

                // 3. Busca todos os relatórios
                const relatoriosResponse = await api.get('/api/relatorios');

                // 4. Filtra apenas os relatórios do aluno do usuário logado
                const relatoriosDoUsuario = relatoriosResponse.data.filter(
                    (relatorio: Relatorio) => relatorio.alunoId === alunoDoUsuario.id
                );

                setRelatorios(relatoriosDoUsuario);
                setError(null);

            } catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes('403')) {
                        setError('Acesso negado: faça login para continuar');
                        router.push('/login');
                    } else {
                        setError(`Erro ao carregar relatórios: ${error.message}`);
                    }
                } else {
                    setError('Erro desconhecido ao carregar relatórios');
                }
                console.error('Erro detalhado:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserAndRelatorios();
    }, [router]);

    const formatarData = (dataString: string): string => {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const filteredRelatorios = relatorios.filter(relatorio => {
        // Lógica de busca por termo: tipo, resumo ou nome do aluno (mesmo que na página anterior)
        const matchesSearch =
            relatorio.tipoRelatorio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            relatorio.resumoAtividades.toLowerCase().includes(searchTerm.toLowerCase()) ||
            relatorio.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()); // Adiciona busca por nome do aluno

        // Lógica de filtragem por período (Data Inicial e Data Final)
        const relatorioDataInicial = new Date(relatorio.dataInicial + 'T00:00:00');
        const relatorioDataFinal = new Date(relatorio.dataFinal + 'T00:00:00');

        const filterStartDate = startDate ? new Date(startDate + 'T00:00:00') : null;
        const filterEndDate = endDate ? new Date(endDate + 'T00:00:00') : null;

        const matchesPeriod =
            (!filterStartDate || relatorioDataFinal >= filterStartDate) &&
            (!filterEndDate || relatorioDataInicial <= filterEndDate);

        return matchesSearch && matchesPeriod;
    });

    // Remova availableMonths, pois não é mais necessário para o filtro de período
    // const availableMonths = Array.from(
    //     new Set(relatorios.map(r => getMonthFromDate(r.dataInicial)))
    // ).sort((a, b) => b.localeCompare(a));

    const generateTitulo = (relatorio: Relatorio): string => {
        const tipo = relatorio.tipoRelatorio || 'Relatório';
        const mesAno = new Date(relatorio.dataInicial).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });

        return `${tipo} (${mesAno})`;
    };

    return (
        <>
            <NavBar />
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-10">
                            <div className="level">
                                <div className="level-left">
                                    <h1 className="title">Meus Relatórios</h1>
                                </div>
                                <div className="level-right">
                                    <button
                                        className="button is-primary"
                                        onClick={() => router.push('relatorios/relatorio-mensal-pet')}
                                    >
                                        Novo Relatório
                                    </button>
                                </div>
                            </div>

                            {/* --- Novos campos de busca aplicados aqui --- */}
                            <div className="box mb-5">
                                <div className="field is-horizontal">
                                    <div className="field-body">
                                        <div className="field">
                                            <label className="label is-small mb-1">Tipo / Conteúdo</label>
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="text"
                                                    placeholder="Buscar por nome, tipo ou conteúdo..."
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
                            {/* --- Fim dos novos campos de busca --- */}


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
                                    {searchTerm || startDate || endDate ?
                                        "Nenhum relatório encontrado com os filtros aplicados." :
                                        "Você ainda não possui relatórios cadastrados."}
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
                                                    <th>Tipo</th>
                                                    <th>Período</th>
                                                    <th>Resumo</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRelatorios.map((relatorio) => (
                                                    <tr key={relatorio.id}>
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