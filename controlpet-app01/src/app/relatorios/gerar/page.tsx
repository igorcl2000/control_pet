// app/relatorio/gerar/page.tsx
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';
import A4ReportTemplate from '../../../components/A4ReportTemplate';

interface Usuario {
    id: number;
    nome: string;
    email: string;
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

interface ReportData {
    id: number;
    tipoRelatorio: string;
    dataInicial: string;
    dataFinal: string;
    dataEnvio?: string;
    resumoAtividades: string;
    comentarios?: string;
    alunoId: number;
    alunoNome?: string;
}

interface AvaliacaoTutorData {
    id?: number;
    relatorioId: number;
    cargaHoraria: string;
    interesseAtividades: string;
    habilidadesDesenvolvidas: string;
    outrasInformacoes: string;
}

type AvaliacaoRating = 'RUIM' | 'REGULAR' | 'BOM' | 'ÓTIMO' | ''; // Adicionado 'ÓTIMO' aqui também para consistência

const getValidRating = (rating: string | undefined | null): AvaliacaoRating => {
    if (rating) {
        const upperRating = rating.toUpperCase();
        if (upperRating === 'OTIMO') { // Verifica se é "OTIMO" (sem acento)
            return 'ÓTIMO'; // Retorna "ÓTIMO" (com acento)
        }
        if (['RUIM', 'REGULAR', 'BOM', 'ÓTIMO'].includes(upperRating)) {
            return upperRating as AvaliacaoRating;
        }
    }
    return '';
};

const formatarData = (dataString: string): string => {
    if (!dataString) return 'N/A';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};

const ReportPage: React.FC<{}> = () => {
    const searchParams = useSearchParams();
    const relatorioId = searchParams.get('id');

    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [alunoData, setAlunoData] = useState<Aluno | null>(null);
    const [avaliacaoTutorData, setAvaliacaoTutorData] = useState<AvaliacaoTutorData | null>(null);

    const [isLoadingReport, setIsLoadingReport] = useState(true);
    const [errorReport, setErrorReport] = useState<string | null>(null);

    const [html2pdf, setHtml2pdf] = useState<any>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [downloadInitiated, setDownloadInitiated] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('html2pdf.js')
                .then((module) => {
                    setHtml2pdf(module.default);
                })
                .catch((error) => {
                    console.error("Falha ao carregar html2pdf.js:", error);
                });
        }
    }, []);

    const fetchData = useCallback(async () => {
        if (!relatorioId) {
            setErrorReport('ID do relatório não fornecido.');
            setIsLoadingReport(false);
            return;
        }

        setIsLoadingReport(true);
        setErrorReport(null);
        try {
            const reportResponse = await api.get(`/api/relatorios/${relatorioId}`);
            const fetchedReportData: ReportData = reportResponse.data;
            setReportData(fetchedReportData);

            if (fetchedReportData.alunoId) {
                const alunoResponse = await api.get(`/api/alunos/${fetchedReportData.alunoId}`);
                setAlunoData(alunoResponse.data);
            } else {
                setErrorReport('ID do aluno não encontrado no relatório.');
            }

            try {
                const avaliacaoResponse = await api.get<AvaliacaoTutorData>(`/api/avaliacoes-relatorio/relatorio/${relatorioId}`);
                if (avaliacaoResponse.data) {
                    setAvaliacaoTutorData(avaliacaoResponse.data);
                } else {
                    setAvaliacaoTutorData({
                        relatorioId: parseInt(relatorioId),
                        cargaHoraria: 'OTIMO', // Mantive 'OTIMO' aqui para ser processado pela função
                        interesseAtividades: 'OTIMO', // Mantive 'OTIMO' aqui para ser processado pela função
                        habilidadesDesenvolvidas: 'OTIMO', // Mantive 'OTIMO' aqui para ser processado pela função
                        outrasInformacoes: '',
                    });
                }
            } catch (avaliacaoError: any) {
                console.warn('Erro ao buscar avaliação ou nenhuma avaliação encontrada. Preenchendo com valores padrão:', avaliacaoError);
                setAvaliacaoTutorData({
                    relatorioId: parseInt(relatorioId),
                    cargaHoraria: 'OTIMO', // Mantive 'OTIMO' aqui para ser processado pela função
                    interesseAtividades: 'OTIMO', // Mantive 'OTIMO' aqui para ser processado pela função
                    habilidadesDesenvolvidas: 'OTIMO', // Mantive 'OTIMO' aqui para ser processado pela função
                    outrasInformacoes: '',
                });
            }

        } catch (error: any) {
            console.error('Erro ao buscar dados:', error);
            setErrorReport(error.response?.data?.message || 'Erro ao carregar relatório ou dados do aluno. Tente novamente.');
        } finally {
            setIsLoadingReport(false);
        }
    }, [relatorioId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const todayDate = new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());

    const handleDownloadPdf = useCallback(() => {
        if (contentRef.current && html2pdf && reportData && alunoData && !downloadInitiated) {
            setDownloadInitiated(true);

            const options = {
                margin: [5, 5, 5, 5],
                filename: `RelatorioMensalPET_${new Date(`${reportData.dataInicial}T12:00:00`).toLocaleString('pt-BR', { month: 'long' }) || 'documento'}_${alunoData?.usuario?.nome || 'documento'}.pdf`,
                image: { type: 'png', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    scrollY: 0,
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: {
                    mode: ['css', 'avoid-all', 'legacy']
                }
            };

            const element = contentRef.current;
            html2pdf.from(element).set(options).save();

        } else if (downloadInitiated) {
            console.log("Download já foi iniciado. Ignorando chamadas múltiplas.");
        } else {
            console.warn("html2pdf.js ainda não carregado, ou dados pendentes, ou contentRef é nulo.");
        }
    }, [html2pdf, reportData, alunoData, downloadInitiated]);

    // O useEffect para download automático continua o mesmo para garantir o download inicial
    useEffect(() => {
        if (!isLoadingReport && reportData && alunoData && html2pdf && !downloadInitiated) {
            handleDownloadPdf();
        }
    }, [isLoadingReport, reportData, alunoData, html2pdf, downloadInitiated, handleDownloadPdf]);


    // NOVA FUNÇÃO PARA ATUALIZAR A PÁGINA
    const handleRefreshPage = () => {
        window.location.reload();
    };


    if (isLoadingReport) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <p className="title is-4">Carregando relatório e dados do aluno...</p>
            </div>
        );
    }

    if (errorReport) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <p className="title is-4 has-text-danger">Erro ao carregar relatório:</p>
                <p className="subtitle is-6 has-text-danger">{errorReport}</p>
            </div>
        );
    }

    if (!reportData || !alunoData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <p className="title is-4">Nenhum relatório ou dados do aluno encontrados para o ID fornecido.</p>
            </div>
        );
    }

    const templateProps = {
        institutionPetGroup: "PET Computação Ituiutaba",
        tutorName: "Ailton Luiz Dias Siqueira Junior",
        todayDate: todayDate,
        studentName: alunoData?.usuario?.nome || 'N/A',
        studentCourse: alunoData?.curso || 'N/A',
        activitiesSummary: reportData.resumoAtividades,
        petitionerComments: reportData.comentarios || '',
        reportMonth: new Date(`${reportData.dataInicial}T12:00:00`).toLocaleString('pt-BR', { month: 'long' }),
        reportYear: new Date(reportData.dataInicial).getFullYear().toString(),
        studentType: alunoData?.tipoEstudante === 'voluntario' ? 'voluntário' : alunoData?.tipoEstudante || 'N/A',
        activityStartDate: formatarData(reportData.dataInicial),
        activityEndDate: formatarData(reportData.dataFinal),
        announcement: alunoData?.editalIngresso || 'N/A',
        studentSignatureName: alunoData?.usuario?.nome || 'N/A',
        // Aqui, getValidRating já fará a conversão para 'ÓTIMO' se for 'OTIMO'
        tutorCargaHoraria: getValidRating(avaliacaoTutorData?.cargaHoraria),
        tutorInteresseAtividades: getValidRating(avaliacaoTutorData?.interesseAtividades),
        tutorHabilidadesDesenvolvidas: getValidRating(avaliacaoTutorData?.habilidadesDesenvolvidas),
        tutorOutrasInformacoes: avaliacaoTutorData?.outrasInformacoes || '',
    };

    return (
        <div style={{
            width: '100%',
            backgroundColor: '#f0f0f0',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '20px',
            paddingBottom: '40px',
        }}>
            {/* O botão agora chama handleRefreshPage */}
            <button
                className="download-button button is-primary"
                onClick={handleRefreshPage} // MUDANÇA AQUI
                style={{ marginBottom: '20px' }}
                // O botão de "Atualizar" não precisa ser desabilitado pelas mesmas condições do download
                disabled={isLoadingReport} // Pode ser desabilitado enquanto os dados estão carregando
            >
                {isLoadingReport ? "Carregando..." : "Download"} {/* MUDANÇA AQUI */}
            </button>

            <div ref={contentRef} style={{
                backgroundColor: '#ffffff',
                width: '210mm',
                minHeight: '297mm',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                boxSizing: 'border-box',
                position: 'relative',
            }}>
                <A4ReportTemplate {...templateProps} />
            </div>
        </div>
    );
};

export default ReportPage;