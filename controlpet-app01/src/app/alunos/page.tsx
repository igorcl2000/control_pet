'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { AxiosError } from 'axios'; // Importar AxiosError para melhor tipagem de erros

// Interfaces
interface Usuario {
    id: number;
    nome: string;
    email: string;
    tipo: string;
    criadoEm: string;
    atualizadoEm: string;
}

interface Aluno {
    id: number;
    usuario: Usuario;
    idade: number;
    periodoAno: string;
    editalIngresso: string;
    tipoEstudante: string;
    curso: string;
    criadoEm: string;
    atualizadoEm: string;
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

export default function GerenciarAlunos() {
    const router = useRouter();
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
    const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
    const [isModalActive, setIsModalActive] = useState(false);
    const [alunoToDelete, setAlunoToDelete] = useState<Aluno | null>(null);
    const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
    // Novo estado para a mensagem de reset de senha
    const [resetPasswordMessage, setResetPasswordMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    // Novos estados para o modal de confirmação de reset de senha
    const [isResetConfirmModalActive, setIsResetConfirmModalActive] = useState(false);
    const [alunoToResetPassword, setAlunoToResetPassword] = useState<Aluno | null>(null);


    // --- Estados para Paginação ---
    const [currentPage, setCurrentPage] = useState(1);
    const [alunosPerPage] = useState(10); // Quantidade de alunos por página

    // Busca os dados do usuário logado e verifica se é orientador
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Verifica o usuário logado
                const userResponse = await api.get('/auth/me');
                setCurrentUser(userResponse.data);

                // Se não for orientador, redireciona
                if (userResponse.data.tipoUsuario !== 'orientador') {
                    setError('Acesso restrito a orientadores.');
                    router.push('/dashboard');
                    return;
                }

                // Busca todos os alunos
                const alunosResponse = await api.get('/api/alunos');
                setAlunos(alunosResponse.data);
                setError(null);

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                if (error instanceof AxiosError && error.response?.status === 401) {
                    setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
                    localStorage.removeItem('token');
                    router.push('/login');
                } else {
                    setError('Erro ao carregar dados dos alunos. Verifique sua conexão ou tente novamente.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    // Filtra alunos baseado no termo de busca
    const filteredAlunos = alunos.filter(aluno => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            aluno.usuario.nome.toLowerCase().includes(searchLower) ||
            aluno.usuario.email.toLowerCase().includes(searchLower) ||
            (aluno.curso && aluno.curso.toLowerCase().includes(searchLower)) ||
            (aluno.tipoEstudante && aluno.tipoEstudante.toLowerCase().includes(searchLower))
        );
    });

    // --- Lógica de Paginação ---
    const indexOfLastAluno = currentPage * alunosPerPage;
    const indexOfFirstAluno = indexOfLastAluno - alunosPerPage;
    const currentAlunos = filteredAlunos.slice(indexOfFirstAluno, indexOfLastAluno);

    const totalPages = Math.ceil(filteredAlunos.length / alunosPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return; // Evita páginas inválidas
        setCurrentPage(pageNumber);
    };

    // Gera os números das páginas para exibição na paginação
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Número máximo de páginas para exibir (ex: 1, 2, 3, 4, 5)
        let startPage: number, endPage: number;

        if (totalPages <= maxPagesToShow) {
            // Menos páginas do que o máximo, mostra todas
            startPage = 1;
            endPage = totalPages;
        } else {
            // Mais páginas, calcula o range para exibir o centro
            if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - Math.floor(maxPagesToShow / 2);
                endPage = currentPage + Math.floor(maxPagesToShow / 2);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };


    // Formata data para exibição (mantido)
    const formatarData = (dataString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    // Atualiza um aluno (mantido)
    const handleUpdateAluno = async (updatedAluno: Aluno) => {
        try {
            setIsLoading(true);
            setError(null);
            setResetPasswordMessage(null); // Limpa mensagens de reset ao atualizar aluno

            const dadosParaAPI = {
                usuarioId: updatedAluno.usuario.id,
                idade: updatedAluno.idade,
                periodoAno: updatedAluno.periodoAno,
                editalIngresso: updatedAluno.editalIngresso,
                tipoEstudante: updatedAluno.tipoEstudante,
                curso: updatedAluno.curso
            };

            const response = await api.put(`/api/alunos/${updatedAluno.id}`, dadosParaAPI);

            setAlunos(prev => prev.map(aluno =>
                aluno.id === updatedAluno.id ? { ...response.data, usuario: aluno.usuario } : aluno
            ));

            setIsModalActive(false);
            setEditingAluno(null);

        } catch (error) {
            console.error('Erro ao atualizar aluno:', error);
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const errorMessage = axiosError.response?.data?.message || 'Erro ao atualizar aluno. Tente novamente.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Deleta um aluno (mantido)
    const handleDeleteAluno = async () => {
        if (!alunoToDelete) return;

        try {
            setIsLoading(true);
            setError(null);
            setResetPasswordMessage(null); // Limpa mensagens de reset ao deletar

            await api.delete(`/api/alunos/${alunoToDelete.id}`);

            setAlunos(prev => prev.filter(aluno => aluno.id !== alunoToDelete.id));

            setIsDeleteModalActive(false);
            setAlunoToDelete(null);
            // Ao deletar, recalcula a página atual se a última página ficar vazia
            if (currentAlunos.length === 1 && currentPage > 1 && totalPages === 1) {
                setCurrentPage(currentPage - 1);
            }

        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
            const axiosError = error as AxiosError<ApiErrorResponse>;

            if (axiosError.response) {
                if (axiosError.response.status === 409 || axiosError.response.status === 500) {
                    const apiMessage = axiosError.response.data?.message?.toLowerCase();
                    if (apiMessage && (apiMessage.includes('relatório') || apiMessage.includes('dependênci'))) {
                        setError('Não foi possível excluir o aluno. Primeiro, é necessário excluir todos os relatórios vinculados a ele.');
                    } else {
                        setError(axiosError.response.data?.message || 'Não foi possível excluir o aluno. Primeiro, é necessário excluir todos os relatórios vinculados a ele.');
                    }
                } else {
                    setError(axiosError.response.data?.message || 'Erro ao deletar aluno. Verifique sua permissão ou tente novamente.');
                }
            } else {
                setError('Erro de rede ou conexão com o servidor. Verifique sua internet.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Função para iniciar o processo de reset de senha, abrindo o modal de confirmação
    const openResetConfirmModal = (aluno: Aluno) => {
        setAlunoToResetPassword(aluno);
        setIsResetConfirmModalActive(true);
        setError(null); // Limpa erros gerais
        setResetPasswordMessage(null); // Limpa mensagens de reset anteriores
    };


    // Função para executar o reset de senha após a confirmação
    const handleResetPassword = async () => {
        if (!alunoToResetPassword) return; // Garante que há um aluno selecionado

        setIsLoading(true);
        setResetPasswordMessage(null); // Limpa qualquer mensagem anterior
        setError(null); // Limpa erros gerais

        try {
            await api.put(`/auth/reset-password/${alunoToResetPassword.usuario.id}`);
            setResetPasswordMessage({ type: 'success', text: `Senha do aluno ${alunoToResetPassword.usuario.nome} resetada para "Senha123" com sucesso!` });
            // Fechar o modal de confirmação após o sucesso
            setIsResetConfirmModalActive(false);
            setAlunoToResetPassword(null);
        } catch (error) {
            console.error('Erro ao resetar senha:', error);
            const axiosError = error as AxiosError<ApiErrorResponse>;
            let errorMessage = 'Erro ao resetar senha. Tente novamente.';

            if (axiosError.response) {
                if (axiosError.response.status === 401) {
                    errorMessage = 'Você não está autorizado. Sua sessão pode ter expirado. Faça login novamente.';
                    localStorage.removeItem('token');
                    router.push('/login');
                } else if (axiosError.response.status === 403) {
                    errorMessage = 'Acesso negado. Apenas orientadores podem resetar senhas.';
                } else if (axiosError.response.status === 404) {
                    errorMessage = 'Usuário não encontrado.';
                } else {
                    errorMessage = axiosError.response.data?.message || errorMessage;
                }
            } else {
                errorMessage = 'Erro de rede. Verifique sua conexão.';
            }
            setResetPasswordMessage({ type: 'danger', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };


    // Abre modal de edição (mantido)
    const openEditModal = (aluno: Aluno) => {
        setEditingAluno(aluno);
        setIsModalActive(true);
        setError(null);
        setResetPasswordMessage(null); // Limpa mensagens ao abrir o modal
    };

    // Abre modal de confirmação de exclusão (mantido)
    const openDeleteModal = (aluno: Aluno) => {
        setAlunoToDelete(aluno);
        setIsDeleteModalActive(true);
        setError(null);
        setResetPasswordMessage(null); // Limpa mensagens ao abrir o modal
    };

    // Função para fechar modais e limpar estados (mantido)
    const closeModal = () => {
        setIsModalActive(false);
        setEditingAluno(null);
        setIsDeleteModalActive(false);
        setAlunoToDelete(null);
        setIsResetConfirmModalActive(false); // Fechar modal de confirmação de reset
        setAlunoToResetPassword(null); // Limpar aluno para reset
        setError(null);
        setResetPasswordMessage(null); // Sempre limpa a mensagem de reset ao fechar o modal
    };

    return (
        <>
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-10">
                            <div className="level">
                                <div className="level-left">
                                    <h1 className="title">Gerenciar Alunos</h1>
                                </div>
                                <div className="level-right">
                                    <p className="subtitle">
                                        Logado como: {currentUser?.nome} ({currentUser?.tipoUsuario})
                                    </p>
                                </div>
                            </div>

                            {/* Barra de busca */}
                            <div className="box mb-5">
                                <div className="field">
                                    <div className="control has-icons-left">
                                        <input
                                            className="input"
                                            type="text"
                                            placeholder="Buscar por nome, email, curso ou tipo..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1); // Resetar para a primeira página ao buscar
                                            }}
                                        />
                                        <span className="icon is-left">
                                            <i className="fas fa-search"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Loading/Error/Empty states */}
                            {isLoading && !editingAluno && !alunoToDelete && !isResetConfirmModalActive ? ( // Ajustado para não mostrar loading quando modal está ativo
                                <div className="has-text-centered">
                                    <span className="icon is-large">
                                        <i className="fas fa-spinner fa-pulse fa-2x"></i>
                                    </span>
                                    <p>Carregando alunos...</p>
                                </div>
                            ) : error && !isModalActive && !isDeleteModalActive && !isResetConfirmModalActive ? (
                                <div className="notification is-danger">
                                    <button
                                        className="delete"
                                        onClick={() => setError(null)}
                                    ></button>
                                    {error}
                                </div>
                            ) : filteredAlunos.length === 0 ? (
                                <div className="notification is-warning">
                                    {searchTerm ?
                                        "Nenhum aluno encontrado com os critérios de busca." :
                                        "Nenhum aluno cadastrado no sistema."}
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <span className="tag is-info">
                                            {filteredAlunos.length} {filteredAlunos.length === 1 ? 'aluno encontrado' : 'alunos encontrados'}
                                        </span>
                                    </div>

                                    {/* Tabela de alunos */}
                                    <div className="table-container">
                                        <table className="table is-fullwidth is-striped is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Email</th>
                                                    <th>Curso</th>
                                                    <th>Tipo</th>
                                                    <th>Idade</th>
                                                    <th>Período</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentAlunos.map((aluno) => (
                                                    <tr key={aluno.id}>
                                                        <td>{aluno.usuario.nome}</td>
                                                        <td>{aluno.usuario.email}</td>
                                                        <td>{aluno.curso}</td>
                                                        <td>{aluno.tipoEstudante}</td>
                                                        <td>{aluno.idade}</td>
                                                        <td>{aluno.periodoAno}º</td>
                                                        <td>
                                                            <div className="buttons">
                                                                <button
                                                                    className="button is-small is-info"
                                                                    onClick={() => openEditModal(aluno)}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="button is-small is-danger"
                                                                    onClick={() => openDeleteModal(aluno)}
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Paginação Bulma */}
                                    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                                        <button
                                            className="pagination-previous"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            className="pagination-next"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Próxima
                                        </button>
                                        <ul className="pagination-list">
                                            {getPageNumbers().map(number => (
                                                <li key={number}>
                                                    <a
                                                        onClick={() => paginate(number)}
                                                        className={`pagination-link ${number === currentPage ? 'is-current' : ''}`}
                                                        aria-label={`Página ${number}`}
                                                        aria-current={number === currentPage ? 'page' : undefined}
                                                    >
                                                        {number}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Edição */}
            {editingAluno && (
                <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
                    <div className="modal-background" onClick={closeModal}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Editar Aluno</p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={closeModal}
                            ></button>
                        </header>
                        <section className="modal-card-body">
                            {error && (
                                <div className="notification is-danger">
                                    <button className="delete" onClick={() => setError(null)}></button>
                                    {error}
                                </div>
                            )}
                            {/* Mensagem de sucesso/erro do reset de senha */}
                            {resetPasswordMessage && (
                                <div className={`notification is-${resetPasswordMessage.type}`}>
                                    <button className="delete" onClick={() => setResetPasswordMessage(null)}></button>
                                    {resetPasswordMessage.text}
                                </div>
                            )}

                            <div className="field">
                                <label className="label">Nome</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        value={editingAluno.usuario.nome}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="email"
                                        value={editingAluno.usuario.email}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Curso</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        value={editingAluno.curso}
                                        onChange={(e) => setEditingAluno({
                                            ...editingAluno,
                                            curso: e.target.value
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Tipo de Estudante</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            value={editingAluno.tipoEstudante}
                                            onChange={(e) => setEditingAluno({
                                                ...editingAluno,
                                                tipoEstudante: e.target.value
                                            })}
                                        >
                                            <option value="bolsista">Bolsista</option>
                                            <option value="voluntario">Voluntário</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Idade</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="number"
                                        value={editingAluno.idade}
                                        onChange={(e) => setEditingAluno({
                                            ...editingAluno,
                                            idade: parseInt(e.target.value) || 0
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Período/Ano</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        value={editingAluno.periodoAno}
                                        onChange={(e) => setEditingAluno({
                                            ...editingAluno,
                                            periodoAno: e.target.value
                                        })}
                                    />
                                </div>
                            </div>

                            {/* CAMPO: Edital de Ingresso */}
                            <div className="field">
                                <label className="label">Edital de Ingresso</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        value={editingAluno.editalIngresso}
                                        onChange={(e) => setEditingAluno({
                                            ...editingAluno,
                                            editalIngresso: e.target.value
                                        })}
                                        placeholder="Ex: Edital 01/2023"
                                    />
                                </div>
                            </div>

                            {/* NOVO BOTÃO: Resetar Senha */}
                            <div className="field is-grouped is-grouped-centered mt-5">
                                <div className="control">
                                    <button
                                        className="button is-warning"
                                        // Abre o modal de confirmação em vez de chamar diretamente handleResetPassword
                                        onClick={() => editingAluno && openResetConfirmModal(editingAluno)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Resetando...' : 'Resetar Senha'}
                                    </button>
                                </div>
                            </div>

                        </section>
                        <footer className="modal-card-foot">
                            <button
                                className="button is-success mr-2"
                                onClick={() => handleUpdateAluno(editingAluno)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                            <button
                                className="button"
                                onClick={closeModal}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão (mantido) */}
            <div className={`modal ${isDeleteModalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={closeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Confirmar Exclusão</p>
                        <button
                            className="delete"
                            aria-label="close"
                            onClick={closeModal}
                        ></button>
                    </header>
                    <section className="modal-card-body">
                        {error && (
                            <div className="notification is-danger is-light">
                                <button className="delete" onClick={() => setError(null)}></button>
                                {error}
                            </div>
                        )}
                        <p>Tem certeza que deseja excluir o aluno <strong>{alunoToDelete?.usuario.nome}</strong>?</p>
                        <p className="has-text-danger">Esta ação não pode ser desfeita!</p>
                    </section>
                    <footer className="modal-card-foot">
                        <button
                            className="button is-danger"
                            onClick={handleDeleteAluno}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
                        </button>
                        <button
                            className="button"
                            onClick={closeModal}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    </footer>
                </div>
            </div>

            {/* NOVO: Modal de Confirmação de Reset de Senha */}
            {alunoToResetPassword && (
                <div className={`modal ${isResetConfirmModalActive ? 'is-active' : ''}`}>
                    <div className="modal-background" onClick={closeModal}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Confirmar Reset de Senha</p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={closeModal}
                            ></button>
                        </header>
                        <section className="modal-card-body">
                            {resetPasswordMessage && ( // Exibe a mensagem aqui também, se houver
                                <div className={`notification is-${resetPasswordMessage.type} is-light`}>
                                    <button className="delete" onClick={() => setResetPasswordMessage(null)}></button>
                                    {resetPasswordMessage.text}
                                </div>
                            )}
                            <p>Tem certeza que deseja resetar a senha do aluno <strong>{alunoToResetPassword.usuario.nome}</strong>?</p>
                            <p className="has-text-warning">A nova senha será "Senha123".</p>
                            <p className="has-text-danger">Esta ação é irreversível.</p>
                        </section>
                        <footer className="modal-card-foot">
                            <button
                                className="button is-warning mr-2"
                                onClick={handleResetPassword} // Chama a função que faz o reset
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetando...' : 'Confirmar Reset'}
                            </button>
                            <button
                                className="button"
                                onClick={closeModal}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </>
    );
}
