// app/relatorio/gerar/page.tsx
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';
import A4ReportTemplate from '../../../components/A4ReportTemplate';

// Interfaces for type safety
interface Usuario {
    id: number;
    nome: string;
    email: string;
}

interface Aluno {
    id: number;
    usuario: Usuario; // This will contain the student's user data
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
    alunoId: number; // Important: The ID of the student linked to this report
    alunoNome?: string; // If your backend already sends student name with report
}

// Custom date formatting function
const formatarData = (dataString: string): string => {
    // Ensure the date string is in 'YYYY-MM-DD' format before splitting
    if (!dataString) return 'N/A';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};

const ReportPage: React.FC<{}> = () => {
    const searchParams = useSearchParams();
    const relatorioId = searchParams.get('id');

    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [alunoData, setAlunoData] = useState<Aluno | null>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(true);
    const [errorReport, setErrorReport] = useState<string | null>(null);

    const [html2pdf, setHtml2pdf] = useState<any>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Load html2pdf.js dynamically
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

    // Function to fetch report data and associated student data
    const fetchData = useCallback(async () => {
        if (!relatorioId) {
            setErrorReport('ID do relatório não fornecido.');
            setIsLoadingReport(false);
            return;
        }

        setIsLoadingReport(true);
        setErrorReport(null);
        try {
            // Fetch report data
            const reportResponse = await api.get(`/api/relatorios/${relatorioId}`);
            const fetchedReportData: ReportData = reportResponse.data;
            setReportData(fetchedReportData);

            // Now, use reportData.alunoId to fetch the specific student's data
            if (fetchedReportData.alunoId) {
                const alunoResponse = await api.get(`/api/alunos/${fetchedReportData.alunoId}`);
                setAlunoData(alunoResponse.data);
            } else {
                setErrorReport('ID do aluno não encontrado no relatório.');
            }

        } catch (error: any) {
            console.error('Erro ao buscar dados:', error);
            setErrorReport(error.response?.data?.message || 'Erro ao carregar relatório ou dados do aluno. Tente novamente.');
        } finally {
            setIsLoadingReport(false);
        }
    }, [relatorioId]);

    // Call data fetching when the component mounts or report ID changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const todayDate = new Date().toLocaleDateString('pt-BR');

    const handleDownloadPdf = () => {
        if (contentRef.current && html2pdf) {
            const options = {
                margin: [5, 5, 5, 5],
                filename: `relatorio_${alunoData?.usuario?.nome}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
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
        } else {
            console.warn("html2pdf.js ainda não carregado ou contentRef é nulo.");
        }
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

    // Map report data to A4ReportTemplate props
    const templateProps = {
        institutionPetGroup: "PET Computação Ituiutaba", // Adjust as needed
        tutorName: "Ailton Luiz Dias Siqueira Junior", // Adjust as needed
        todayDate: todayDate,
        studentName: alunoData?.usuario?.nome || 'N/A',
        studentCourse: alunoData?.curso || 'N/A',
        activitiesSummary: reportData.resumoAtividades,
        petitionerComments: reportData.comentarios || '',
        reportMonth: new Date(reportData.dataInicial).toLocaleString('pt-BR', { month: 'long' }),
        reportYear: new Date(reportData.dataInicial).getFullYear().toString(),
        studentType: alunoData?.tipoEstudante || 'N/A',
        // Apply the custom formatting function here
        activityStartDate: formatarData(reportData.dataInicial),
        activityEndDate: formatarData(reportData.dataFinal),
        announcement: alunoData?.editalIngresso || 'N/A',
        studentSignatureName: alunoData?.usuario?.nome || 'N/A',
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
            <button
                className="download-button button is-primary"
                onClick={handleDownloadPdf}
                style={{ marginBottom: '20px' }}
                disabled={!html2pdf || isLoadingReport}
            >
                {html2pdf ? "Download PDF" : "Carregando PDF..."}
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