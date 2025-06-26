'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { EditProfileModal } from '@/components/EditProfileModal';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { CreateAlunoModal } from '@/components/CreateAlunoModal';
import api from '@/services/api';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: 'aluno' | 'orientador' | 'admin'; // Adicionado o tipoUsuario
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

export default function Perfil() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [alunoData, setAlunoData] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isPasswordModalActive, setIsPasswordModalActive] = useState(false);
  const [isCreateAlunoModalActive, setIsCreateAlunoModalActive] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const userResponse = await api.get('/auth/me');
        const userData: Usuario = userResponse.data; // Coleta o tipo de usuário
        setUsuario(userData);

        // Se o usuário for um 'aluno', tenta buscar os dados de aluno
        if (userData.tipoUsuario === 'aluno') {
          const alunosResponse = await api.get('/api/alunos');
          const aluno = alunosResponse.data.find((a: any) =>
            a.usuario.id === userData.id
          );

          if (aluno) {
            const alunoCompleteResponse = await api.get(`/api/alunos/${aluno.id}`);
            setAlunoData(alunoCompleteResponse.data);
          }
        }

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar perfil. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, isLoading, router]);

  const handleSubmitPassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setIsPasswordModalActive(false);
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha. Verifique sua senha atual.');
    }
  };

  const handleCreateAlunoSuccess = async () => {
    try {
      setLoading(true);
      const userResponse = await api.get('/auth/me');
      const userData: Usuario = userResponse.data; // Recarrega o tipo de usuário
      setUsuario(userData); // Atualiza o estado do usuário com o novo tipo, se aplicável

      if (userData.tipoUsuario === 'aluno') { // Verifica se agora é um aluno
        const alunosResponse = await api.get('/api/alunos');
        const aluno = alunosResponse.data.find((a: any) =>
          a.usuario.id === userData.id
        );
        if (aluno) {
          const alunoCompleteResponse = await api.get(`/api/alunos/${aluno.id}`);
          setAlunoData(alunoCompleteResponse.data);
        }
      }
      setIsCreateAlunoModalActive(false); // Fecha o modal após sucesso
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <>
        <section className="section">
          <div className="container has-text-centered">
            <span className="icon is-large">
              <i className="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
            <p>Carregando perfil...</p>
          </div>
        </section>
      </>
    );
  }

  if (!isAuthenticated) {
    return <div>Redirecionando...</div>;
  }

  if (error) {
    return (
      <>
        <section className="section">
          <div className="container">
            <div className="notification is-danger">
              {error}
              <button className="button is-small is-white" onClick={() => router.push('/login')}>
                Tentar novamente
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8">
              <div className="card">
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{usuario?.nome}</p>
                      <p className="subtitle is-6">{usuario?.email}</p>
                      {/* Exibe o tipo de usuário */}
                      <p className="subtitle is-6 has-text-grey">
                        Tipo: <strong className="has-text-info">{usuario?.tipoUsuario?.toUpperCase()}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Renderização condicional para Aluno ou Orientador/Admin */}
                  {usuario?.tipoUsuario === 'aluno' ? (
                    !alunoData ? (
                      <div className="notification is-warning mt-5">
                        <p>Você precisa completar seu cadastro como aluno PET.</p>
                        <button
                          className="button is-primary mt-3"
                          onClick={() => setIsCreateAlunoModalActive(true)}
                        >
                          Completar Cadastro
                        </button>
                      </div>
                    ) : (
                      <div className="content mt-5">
                        <div className="columns">
                          <div className="column is-6">
                            <div className="field">
                              <label className="label">Idade</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  value={alunoData.idade}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="field">
                              <label className="label">Período/Ano</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  value={alunoData.periodoAno}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="field">
                              <label className="label">Edital</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  value={alunoData.editalIngresso}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="column is-6">
                            <div className="field">
                              <label className="label">Tipo de Estudante</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  value={alunoData.tipoEstudante}
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
                                  value={alunoData.curso}
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="field">
                              <label className="label">Último Acesso</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  value={new Date(alunoData.atualizadoEm).toLocaleString()}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    // Conteúdo para Orientador/Admin (sem informações de aluno)
                    <div className="content mt-5">
                      <p>
                        Este é o perfil de um **{usuario?.tipoUsuario?.toUpperCase()}**.
                        Não há informações de cadastro de aluno PET a serem exibidas.
                      </p>
                    </div>
                  )}

                  <div className="buttons is-centered mt-5">
                    {/* Botão "Editar Perfil" visível apenas para Alunos com cadastro completo */}
                    {usuario?.tipoUsuario === 'aluno' && alunoData && (
                      <button
                        className="button is-primary"
                        onClick={() => setIsEditModalActive(true)}
                      >
                        Editar Perfil
                      </button>
                    )}
                    {/* Botões "Redefinir Senha" e "Sair" sempre visíveis */}
                    <button
                      className="button is-info"
                      onClick={() => setIsPasswordModalActive(true)}
                    >
                      Redefinir Senha
                    </button>
                    <button
                      className="button is-danger"
                      onClick={logout}
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modais */}
      {/* O modal de edição de perfil só é renderizado se o usuário for aluno e tiver alunoData */}
      {usuario?.tipoUsuario === 'aluno' && alunoData && (
        <EditProfileModal
          isActive={isEditModalActive}
          onClose={() => setIsEditModalActive(false)}
          onSubmit={(updatedData) => {
            setAlunoData(prev => ({
              ...prev!,
              ...updatedData
            }));
          }}
          initialData={{
            usuarioId: alunoData?.usuario.id || 0,
            idade: alunoData?.idade || 0,
            periodoAno: alunoData?.periodoAno || '',
            editalIngresso: alunoData?.editalIngresso || '',
            tipoEstudante: alunoData?.tipoEstudante || 'bolsista',
            curso: alunoData?.curso || ''
          }}
          alunoId={alunoData?.id || 0}
        />
      )}

      {/* O modal de criação de aluno só é renderizado se o usuário for aluno e não tiver alunoData */}
      {usuario?.tipoUsuario === 'aluno' && !alunoData && (
        <CreateAlunoModal
          isActive={isCreateAlunoModalActive}
          onClose={() => setIsCreateAlunoModalActive(false)}
          onSuccess={handleCreateAlunoSuccess}
          usuarioId={usuario?.id || 0}
        />
      )}

      <ChangePasswordModal
        isActive={isPasswordModalActive}
        onClose={() => setIsPasswordModalActive(false)}
        onSubmit={handleSubmitPassword}
      />
    </>
  );
}