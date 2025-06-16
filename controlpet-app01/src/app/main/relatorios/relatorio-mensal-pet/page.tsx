'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/navbar';
import api from '@/services/api';

interface AlunoInfo {
    id: number; // ID do aluno (vindo de /api/alunos)
    usuarioId: number; // ID do usuário (vindo de /auth/me)
    nome: string;
}

export default function RelatorioMensalPET() {
    const router = useRouter();
    const [alunoInfo, setAlunoInfo] = useState<AlunoInfo | null>(null);
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [resumoAtividades, setResumoAtividades] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlunoInfo = async () => {
            try {
                setIsLoading(true);

                // 1. Primeiro busca as informações básicas do usuário
                const userResponse = await api.get('/auth/me');
                const userData = userResponse.data;

                // 2. Depois busca as informações completas do aluno
                const alunosResponse = await api.get('/api/alunos');
                const alunoData = alunosResponse.data.find((aluno: any) =>
                    aluno.usuario.id === userData.id
                );

                if (!alunoData) {
                    throw new Error('Aluno não encontrado para este usuário');
                }

                setAlunoInfo({
                    id: alunoData.id, // ID do aluno (ex: 2)
                    usuarioId: userData.id, // ID do usuário (ex: 3)
                    nome: userData.nome
                });

                setError(null);
            } catch (error) {
                console.error('Erro ao obter informações do aluno:', error);
                setError('Erro ao carregar informações do aluno. Faça login novamente.');
                router.push('/main/perfil');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlunoInfo();
    }, [router]);

    // Obter a data atual no formato YYYY-MM-DD
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const submit = async () => {
        // Validação básica
        if (!dataInicial || !dataFinal || !resumoAtividades) {
            setError('Preencha todos os campos obrigatórios!');
            return;
        }

        if (!alunoInfo) {
            setError('Informações do aluno não carregadas. Tente novamente.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/relatorios', {
                alunoId: alunoInfo.id, // Usando o ID do aluno (não do usuário)
                tipoRelatorio: "Relatório Mensal",
                dataInicial,
                dataFinal,
                dataEnvio: getCurrentDate(),
                resumoAtividades,
                comentarios
            });

            alert('Relatório salvo com sucesso!');
            console.log('Resposta da API:', response.data);

            // Redireciona para a página de histórico após sucesso
            router.push('/main/hist-relatorios');

        } catch (error) {
            console.error('Erro:', error);
            setError('Erro ao salvar relatório!');
        } finally {
            setIsLoading(false);
        }
    };

    if (!alunoInfo && !error) {
        return (
            <>
                <NavBar />
                <section className="section">
                    <div className="container">
                        <div className="has-text-centered">
                            <span className="icon is-large">
                                <i className="fas fa-spinner fa-pulse fa-2x"></i>
                            </span>
                            <p>Carregando informações do usuário...</p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-8">
                            <h1 className="title has-text-centered mb-6">Relatório Mensal PET</h1>

                            {error && (
                                <div className="notification is-danger mb-5">
                                    <button className="delete" onClick={() => setError(null)}></button>
                                    {error}
                                </div>
                            )}

                            {/* Informações do Aluno */}
                            <div className="field mb-5">
                                <label className="label">Aluno</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        value={alunoInfo?.nome || ''}
                                        readOnly
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Período (Inicial e Final) */}
                            <div className="columns mb-5">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Período Inicial*</label>
                                        <div className="control">
                                            <input
                                                type="date"
                                                className="input"
                                                value={dataInicial}
                                                onChange={(e) => setDataInicial(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Período Final*</label>
                                        <div className="control">
                                            <input
                                                type="date"
                                                className="input"
                                                value={dataFinal}
                                                onChange={(e) => setDataFinal(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resumo de Atividades */}
                            <div className="field mb-5">
                                <label className="label">Resumo de Atividades*</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        placeholder="Quais foram as atividades desenvolvidas?"
                                        value={resumoAtividades}
                                        onChange={(e) => setResumoAtividades(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Comentários e Dificuldades */}
                            <div className="field mb-6">
                                <label className="label">Comentários e dificuldades</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        placeholder="Quais foram as dificuldades durante o mês? Deixe um comentário."
                                        value={comentarios}
                                        onChange={(e) => setComentarios(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="field is-grouped is-grouped-centered">
                                <div className="control">
                                    <button
                                        onClick={submit}
                                        className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                                        disabled={isLoading || !alunoInfo}
                                    >
                                        Salvar
                                    </button>
                                </div>
                                <div className="control">
                                    <button
                                        onClick={() => router.push('/historico-relatorios')}
                                        className="button is-danger"
                                    >
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}