'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { AxiosError } from 'axios'; // Importar AxiosError para melhor tipagem de erros

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

// Tipo para erros da API (se a API retornar um formato específico para erros)
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

    // Busca os dados do usuário logado e verifica se é orientador
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Verifica o usuário logado
                const userResponse = await api.get('/auth/me');
                // É crucial que `userResponse.data.tipo` esteja presente e seja `orientador` ou `aluno`
                // Se sua API retorna `tipoUsuario`, use `userResponse.data.tipoUsuario`
                setCurrentUser(userResponse.data);

                // Se não for orientador, redireciona
                if (userResponse.data.tipoUsuario !== 'orientador') { // Ajuste para `tipoUsuario` se sua API usa esse nome
                    setError('Acesso restrito a orientadores.');
                    router.push('/dashboard'); // Redireciona para o dashboard ou outra página segura
                    return;
                }

                // Busca todos os alunos
                const alunosResponse = await api.get('/api/alunos');
                setAlunos(alunosResponse.data);
                setError(null);

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                // Melhorar o tratamento de erro para caso de token inválido ou não autenticado
                if (error instanceof AxiosError && error.response?.status === 401) {
                    setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
                    localStorage.removeItem('token'); // Limpa o token inválido
                    router.push('/login'); // Redireciona para o login
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

    // Formata data para exibição
    const formatarData = (dataString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    // Atualiza um aluno
    const handleUpdateAluno = async (updatedAluno: Aluno) => {
        try {
            setIsLoading(true);
            setError(null); // Limpa erros anteriores

            // Prepara os dados no formato que a API espera (apenas campos editáveis)
            const dadosParaAPI = {
                usuarioId: updatedAluno.usuario.id,
                idade: updatedAluno.idade,
                periodoAno: updatedAluno.periodoAno,
                editalIngresso: updatedAluno.editalIngresso,
                tipoEstudante: updatedAluno.tipoEstudante,
                curso: updatedAluno.curso
            };

            // Atualiza no backend
            const response = await api.put(`/api/alunos/${updatedAluno.id}`, dadosParaAPI);

            // Atualiza no state mantendo os dados originais do usuário (que não são alterados)
            setAlunos(prev => prev.map(aluno =>
                aluno.id === updatedAluno.id ? { ...response.data, usuario: aluno.usuario } : aluno
            ));

            // Fecha o modal
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

    // Deleta um aluno
    const handleDeleteAluno = async () => {
        if (!alunoToDelete) return;

        try {
            setIsLoading(true);
            setError(null); // Limpa erros anteriores

            // Deleta no backend
            await api.delete(`/api/alunos/${alunoToDelete.id}`);

            // Atualiza o state removendo o aluno deletado
            setAlunos(prev => prev.filter(aluno => aluno.id !== alunoToDelete.id));

            // Fecha o modal de confirmação
            setIsDeleteModalActive(false);
            setAlunoToDelete(null);

        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
            const axiosError = error as AxiosError<ApiErrorResponse>;

            // Verifica se é um erro do Axios e se há uma resposta
            if (axiosError.response) {
                // Se o status for 409 Conflict (ou 500 se sua API sempre retorna 500 para dependências)
                // E a mensagem contém o texto esperado
                if (axiosError.response.status === 409 || axiosError.response.status === 500) {
                    const apiMessage = axiosError.response.data?.message?.toLowerCase();
                    // Assumindo que sua API retorna algo como "há relatórios associados" ou "dependências encontradas"
                    if (apiMessage && (apiMessage.includes('relatório') || apiMessage.includes('dependênci'))) {
                        setError('Não foi possível excluir o aluno. Primeiro, é necessário excluir todos os relatórios vinculados a ele.');
                    } else {
                        // Mensagem genérica para outros erros 409/500
                        setError(axiosError.response.data?.message || 'Não foi possível excluir o aluno. Primeiro, é necessário excluir todos os relatórios vinculados a ele.');
                    }
                } else {
                    // Outros erros de status (ex: 404, 403, etc.)
                    setError(axiosError.response.data?.message || 'Erro ao deletar aluno. Verifique sua permissão ou tente novamente.');
                }
            } else {
                // Erros sem resposta (ex: rede offline)
                setError('Erro de rede ou conexão com o servidor. Verifique sua internet.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Abre modal de edição
    const openEditModal = (aluno: Aluno) => {
        setEditingAluno(aluno);
        setIsModalActive(true);
        setError(null); // Limpa erros ao abrir o modal
    };

    // Abre modal de confirmação de exclusão
    const openDeleteModal = (aluno: Aluno) => {
        setAlunoToDelete(aluno);
        setIsDeleteModalActive(true);
        setError(null); // Limpa erros ao abrir o modal
    };

    // Função para fechar modais e limpar estados
    const closeModal = () => {
        setIsModalActive(false);
        setEditingAluno(null);
        setIsDeleteModalActive(false);
        setAlunoToDelete(null);
        setError(null); // Garante que o erro seja limpo ao fechar qualquer modal
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
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <span className="icon is-left">
                                            <i className="fas fa-search"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Loading/Error/Empty states */}
                            {isLoading ? (
                                <div className="has-text-centered">
                                    <span className="icon is-large">
                                        <i className="fas fa-spinner fa-pulse fa-2x"></i>
                                    </span>
                                    <p>Carregando alunos...</p>
                                </div>
                            ) : error && !isModalActive && !isDeleteModalActive ? (
                                // Exibe erro principal da página, não os de dentro dos modais
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
                                                {filteredAlunos.map((aluno) => (
                                                    <tr key={aluno.id}>
                                                        <td>{aluno.usuario.nome}</td>
                                                        <td>{aluno.usuario.email}</td>
                                                        <td>{aluno.curso}</td>
                                                        <td>{aluno.tipoEstudante}</td>
                                                        <td>{aluno.idade}</td>
                                                        <td>{aluno.periodoAno}</td>
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
                            {error && ( // Exibe o erro dentro do modal de edição
                                <div className="notification is-danger">
                                    <button className="delete" onClick={() => setError(null)}></button>
                                    {error}
                                </div>
                            )}

                            {/* Campos de usuário (somente leitura) */}
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

                            {/* Campos editáveis do aluno */}
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
                                        placeholder="Ex: 2025.1"
                                    />
                                </div>
                            </div>

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
                                    />
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

            {/* Modal de Confirmação de Exclusão */}
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
                        {error && ( // Exibe o erro dentro do modal de exclusão
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
        </>
    );
}