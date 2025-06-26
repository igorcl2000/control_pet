'use client'

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

export default function HistRelatorios() {
    const router = useRouter();
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const [selectedRelatorio, setSelectedRelatorio] = useState<Relatorio | null>(null);
    const [isDetailsModalActive, setIsDetailsModalActive] = useState(false);

    // --- Novos estados para paginação ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Máximo de 10 itens por página

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

    // Nova função handleDownloadPdf para a tabela
    const handleDownloadPdf = (relatorioId: number) => {
        router.push(`/relatorios/gerar?id=${relatorioId}`);
    };

    useEffect(() => {
        const fetchUserAndRelatorios = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const userResponse = await api.get('/auth/me');
                const userId = userResponse.data.id;
                setCurrentUserId(userId);

                const alunosResponse = await api.get('/api/alunos');
                const alunoDoUsuario = alunosResponse.data.find(
                    (aluno: any) => aluno.usuario.id === userId
                );

                if (!alunoDoUsuario) {
                    setRelatorios([]);
                    setCurrentPage(1); // Resetar para a primeira página
                    return;
                }

                const relatoriosResponse = await api.get('/api/relatorios');

                const relatoriosDoUsuario = relatoriosResponse.data.filter(
                    (relatorio: Relatorio) => relatorio.alunoId === alunoDoUsuario.id
                );

                setRelatorios(relatoriosDoUsuario);
                setCurrentPage(1); // Resetar para a primeira página ao carregar novos dados

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                if (error instanceof Error) {
                    if (error.message.includes('403') || error.message.includes('401')) {
                        setError('Sessão expirada ou acesso negado. Faça login para continuar.');
                        localStorage.removeItem('token'); // Limpa o token se for 401/403
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    } else {
                        setError(`Erro ao carregar relatórios: ${error.message}`);
                    }
                } else {
                    setError('Erro desconhecido ao carregar relatórios');
                }
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
        const matchesSearch =
            relatorio.tipoRelatorio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            relatorio.resumoAtividades.toLowerCase().includes(searchTerm.toLowerCase());
            // alunoNome não é necessário aqui, pois já são relatórios do próprio aluno

        const relatorioDataInicial = new Date(relatorio.dataInicial + 'T00:00:00');
        const relatorioDataFinal = new Date(relatorio.dataFinal + 'T00:00:00');

        const filterStartDate = startDate ? new Date(startDate + 'T00:00:00') : null;
        const filterEndDate = endDate ? new Date(endDate + 'T00:00:00') : null;

        const matchesPeriod =
            (!filterStartDate || relatorioDataFinal >= filterStartDate) &&
            (!filterEndDate || relatorioDataInicial <= filterEndDate);

        return matchesSearch && matchesPeriod;
    });

    // --- Lógica de Paginação ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRelatorios.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRelatorios.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

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

                            <div className="box mb-5">
                                <div className="field is-horizontal">
                                    <div className="field-body">
                                        <div className="field">
                                            <label className="label is-small mb-1">Tipo / Conteúdo</label>
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="text"
                                                    placeholder="Buscar por tipo ou conteúdo..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setCurrentPage(1); // Resetar página na nova busca
                                                    }}
                                                />
                                                <span className="icon is-left">
                                                    <i className="fas fa-search"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label is-small mb-1">Data Inicial:</label>
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => {
                                                        setStartDate(e.target.value);
                                                        setCurrentPage(1); // Resetar página no novo filtro
                                                    }}
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
                                                    onChange={(e) => {
                                                        setEndDate(e.target.value);
                                                        setCurrentPage(1); // Resetar página no novo filtro
                                                    }}
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
                                                {/* Renderiza apenas os itens da página atual */}
                                                {currentItems.map((relatorio) => (
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
                                                                className="button is-small is-info mr-2"
                                                                onClick={() => {
                                                                    setSelectedRelatorio(relatorio);
                                                                    setIsDetailsModalActive(true);
                                                                }}
                                                            >
                                                                Detalhes
                                                            </button>
                                                            <button
                                                                className="button is-small is-success"
                                                                onClick={() => handleDownloadPdf(relatorio.id)} // Passa o ID do relatório
                                                            >
                                                                Baixar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* --- Controles de Paginação --- */}
                                    {totalPages > 1 && ( // Exibe os controles apenas se houver mais de uma página
                                        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                                            <button
                                                className="pagination-previous"
                                                onClick={handlePrevPage}
                                                disabled={currentPage === 1}
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                className="pagination-next"
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages}
                                            >
                                                Próximo
                                            </button>
                                            <ul className="pagination-list">
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <li key={i}>
                                                        <button
                                                            onClick={() => paginate(i + 1)}
                                                            className={`pagination-link ${currentPage === i + 1 ? 'is-current' : ''}`}
                                                            aria-label={`Go to page ${i + 1}`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    )}
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