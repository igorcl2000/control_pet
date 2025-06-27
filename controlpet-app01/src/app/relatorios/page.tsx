'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { RelatorioDetailsModal } from '@/components/RelatorioDetailsModal';
import { AvaliacaoRelatorioModal } from '@/components/AvaliacaoRelatorioModal'; // Importe seu novo modal aqui!
import { AxiosError } from 'axios';

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

interface UserInfo {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: string;
}

interface ApiErrorResponse {
    message: string;
    statusCode?: number;
    error?: string;
}

export default function RelatoriosPage() {
    const router = useRouter();
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedRelatorio, setSelectedRelatorio] = useState<Relatorio | null>(null);
    const [isDetailsModalActive, setIsDetailsModalActive] = useState(false);
    // Novo estado para controlar o modal de avaliação
    const [isAvaliacaoModalActive, setIsAvaliacaoModalActive] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

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

    // Função para lidar com a avaliação do relatório
    const handleAvaliacaoConcluida = (relatorioAvaliado: Relatorio) => {
        // Aqui você pode atualizar o estado dos relatórios se a avaliação mudar algo neles
        // Por exemplo, se a avaliação adicionar um campo 'statusAvaliacao' ao relatório
        setRelatorios(prev => prev.map(r =>
            r.id === relatorioAvaliado.id ? relatorioAvaliado : r
        ));
        setIsAvaliacaoModalActive(false); // Fechar o modal após a avaliação
        setSelectedRelatorio(null); // Limpar o relatório selecionado
        // Opcional: recarregar os relatórios para garantir que os dados estejam atualizados
        // fetchData();
    };

    const handleDownloadPdf = (relatorioId: number) => {
        router.push(`/relatorios/gerar?id=${relatorioId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const userResponse = await api.get('/auth/me');
                setCurrentUser(userResponse.data);

                if (userResponse.data.tipoUsuario !== 'orientador') {
                    setError('Acesso restrito a orientadores. Você será redirecionado.');
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 3000);
                    return;
                }

                const response = await api.get('/api/relatorios');
                setRelatorios(response.data);
                setCurrentPage(1);

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                const axiosError = error as AxiosError<ApiErrorResponse>;

                if (axiosError.response?.status === 401) {
                    setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else if (axiosError.response) {
                    setError(`Erro ao carregar relatórios: ${axiosError.response.data?.message || axiosError.message}`);
                } else {
                    setError('Erro de rede ou desconhecido ao carregar relatórios.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const formatarData = (dataString: string): string => {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const filteredRelatorios = relatorios.filter(relatorio => {
        const matchesSearch =
            relatorio.tipoRelatorio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            relatorio.resumoAtividades.toLowerCase().includes(searchTerm.toLowerCase()) ||
            relatorio.alunoNome.toLowerCase().includes(searchTerm.toLowerCase());

        const relatorioDataInicial = new Date(relatorio.dataInicial + 'T00:00:00');
        const relatorioDataFinal = new Date(relatorio.dataFinal + 'T00:00:00');

        const filterStartDate = startDate ? new Date(startDate + 'T00:00:00') : null;
        const filterEndDate = endDate ? new Date(endDate + 'T00:00:00') : null;

        const matchesPeriod =
            (!filterStartDate || relatorioDataFinal >= filterStartDate) &&
            (!filterEndDate || relatorioDataInicial <= filterEndDate);

        return matchesSearch && matchesPeriod;
    });

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

    if (isLoading && !error) {
        return (
            <section className="section">
                <div className="container has-text-centered">
                    <span className="icon is-large">
                        <i className="fas fa-spinner fa-pulse fa-2x"></i>
                    </span>
                    <p>Carregando relatórios...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section">
                <div className="container">
                    <div className="notification is-danger">
                        <button
                            className="delete"
                            onClick={() => setError(null)}
                        ></button>
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    if (currentUser?.tipoUsuario !== 'orientador') {
        return (
            <section className="section">
                <div className="container has-text-centered">
                    <div className="notification is-warning">
                        Você não tem permissão para acessar esta página. Redirecionando...
                    </div>
                </div>
            </section>
        );
    }

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
                                            <label className="label is-small mb-1">Nome do Aluno ou Conteúdo</label>
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="text"
                                                    placeholder="Buscar por nome, tipo ou conteúdo..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setCurrentPage(1);
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
                                                        setCurrentPage(1);
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
                                                        setCurrentPage(1);
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

                            {filteredRelatorios.length === 0 ? (
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
                                                {currentItems.map((relatorio) => (
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
                                                            <div className="buttons">
                                                                {/* Novo botão "Avaliar" */}
                                                                <button
                                                                    className="button is-small is-warning" // Exemplo de cor
                                                                    onClick={() => {
                                                                        setSelectedRelatorio(relatorio);
                                                                        setIsAvaliacaoModalActive(true);
                                                                    }}
                                                                >
                                                                    Avaliar
                                                                </button>
                                                                <button
                                                                    className="button is-small is-info"
                                                                    onClick={() => {
                                                                        setSelectedRelatorio(relatorio);
                                                                        setIsDetailsModalActive(true);
                                                                    }}
                                                                >
                                                                    Detalhes
                                                                </button>
                                                                <button
                                                                    className="button is-small is-success"
                                                                    onClick={() => handleDownloadPdf(relatorio.id)}
                                                                >
                                                                    Baixar
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* --- Controles de Paginação --- */}
                                    {totalPages > 1 && (
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

                            {/* Renderização do AvaliacaoRelatorioModal */}
                            {selectedRelatorio && (
                                <AvaliacaoRelatorioModal
                                    isActive={isAvaliacaoModalActive}
                                    onClose={() => setIsAvaliacaoModalActive(false)}
                                    relatorio={selectedRelatorio}
                                    onAvaliacaoConcluida={handleAvaliacaoConcluida} // Passe a função de callback
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}