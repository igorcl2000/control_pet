'use client';

import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import A4ReportTemplate from '../../components/A4ReportTemplate'; // Ajuste o caminho conforme sua estrutura

interface ReportPageProps {
    // Se esta página receber props externas, defina-as aqui.
    // Por enquanto, não há props diretamente para ReportPageProps, mas sim para o A4ReportTemplate.
}

const ReportPage: React.FC<ReportPageProps> = () => {
    // Dados para o relatório (podem vir de um banco de dados, formulário, etc.)
    const [institutionPetGroup, setInstitutionPetGroup] = useState("PET Computação Ituiutaba");
    const [tutorName, setTutorName] = useState("Ailton Luiz Dias Siqueira Junior");
    const [studentName, setStudentName] = useState("Nome do Estudante Exemplo");
    const [studentCourse, setStudentCourse] = useState("Ciência da Computação");
    const [activitiesSummary, setActivitiesSummary] = useState("Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros.");
    const [petitionerComments, setPetitionerComments] = useState("Encontrei algumas dificuldades iniciais com a integração da API, mas consegui superá-las com pesquisa e apoio da equipe.");
    const [reportMonth, setReportMonth] = useState("Junho");
    const [reportYear, setReportYear] = useState("2025");
    const [studentType, setStudentType] = useState<'voluntario' | 'bolsista'>('bolsista');
    const [activityStartDate, setActivityStartDate] = useState('01/01/2025');
    const [activityEndDate, setActivityEndDate] = useState('31/12/2025');
    const [announcement, setAnnouncement] = useState('Edital IFTM Nº 01/2025');
    const [studentSignatureName, setStudentSignatureName] = useState('Fulano de Tal da Silva Sauro');

    const todayDate = new Date().toLocaleDateString('pt-BR');

    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        if (contentRef.current) {
            const options = {
                margin: [0, 0, 0, 0],
                filename: 'relatorio_pet.pdf',
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
                }
            };

            const element = contentRef.current;
            html2pdf().from(element).set(options).save();
        }
    };

    return (
        <div style={{ /* Estilos para o corpo da página, para centralizar o A4 na tela */
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0',
            paddingTop: '20px',
            paddingBottom: '40px',
            overflowY: 'auto',
        }}>
            {/* Botão de Download */}
            <button className="download-button" onClick={handleDownloadPdf}>
                Download PDF
            </button>

            {/* Div que contém o conteúdo do relatório no formato A4 */}
            <div ref={contentRef}> {/* A referência agora é na div que envolve o template */}
                <A4ReportTemplate
                    institutionPetGroup={institutionPetGroup}
                    tutorName={tutorName}
                    todayDate={todayDate}
                    studentName={studentName}
                    studentCourse={studentCourse}
                    activitiesSummary={activitiesSummary}
                    petitionerComments={petitionerComments}
                    reportMonth={reportMonth}
                    reportYear={reportYear}
                    studentType={studentType}
                    activityStartDate={activityStartDate}
                    activityEndDate={activityEndDate}
                    announcement={announcement}
                    studentSignatureName={studentSignatureName}
                />
            </div>
        </div>
    );
};

export default ReportPage;