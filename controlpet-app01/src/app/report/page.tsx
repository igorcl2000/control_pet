'use client';

import React, { useRef, useState, useEffect } from 'react';
import A4ReportTemplate from '../../components/A4ReportTemplate';

// REMOVA OU COMENTE ESTA INTERFACE, POIS ELA NÃO ESTÁ SENDO USADA/DEFINIDA
// interface ReportPageProps {
//     // Se esta página receber props externas, defina-as aqui.
//     // Por enquanto, não há props diretamente para ReportPageProps, mas sim para o A4ReportTemplate.
// }

// Remova ": React.FC<ReportPageProps>" se a interface for removida
const ReportPage: React.FC<{}> = () => { // Use React.FC<{}> ou React.FC<any> se não houver props, ou apenas "const ReportPage = () => {"
    // Dados para o relatório (podem vir de um banco de dados, formulário, etc.)
    const [institutionPetGroup, setInstitutionPetGroup] = useState("PET Computação Ituiutaba");
    const [tutorName, setTutorName] = useState("Ailton Luiz Dias Siqueira Junior");
    const [studentName, setStudentName] = useState("Nome do Estudante Exemplo");
    const [studentCourse, setStudentCourse] = useState("Ciência da Computação");
    const [activitiesSummary, setActivitiesSummary] = useState(
        "Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. " +
        "Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. " +
        "Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. " +
        "Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. " +
        "Desenvolvimento de um sistema de gerenciamento de tarefas para o grupo PET, participação em workshops de Python e mentoria para calouros. " +
        "Repita este parágrafo várias vezes para simular um conteúdo longo e forçar a quebra de página: " +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. " +
        "Repita este parágrafo várias vezes para simular um conteúdo longo e forçar a quebra de página: " +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. " +
        "Repita este parágrafo várias vezes para simular um conteúdo longo e forçar a quebra de página: " +
        "Lorem ipsum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. " +
        "Mais algumas linhas para garantir que o texto se estenda por várias páginas e o rodapé apareça corretamente. " +
        "O objetivo é testar a funcionalidade de quebra de página do html2pdf.js com o rodapé na última página. " +
        "Esta é a última linha de teste para o resumo de atividades."
    );
    const [petitionerComments, setPetitionerComments] = useState(
        "Encontrei algumas dificuldades iniciais com a integração da API, mas consegui superá-las com pesquisa e apoio da equipe. " +
        "O aprendizado foi significativo e o projeto está progredindo bem. " +
        "A principal dificuldade foi otimizar a performance da aplicação para grandes volumes de dados. " +
        "No entanto, após implementar caching e otimizações de banco de dados, o problema foi mitigado. " +
        "Continuarei buscando aprimoramento e novas soluções para os desafios futuros." +
        "Este é um texto de exemplo para comentários do petiano, que também pode ser longo."
    );
    const [reportMonth, setReportMonth] = useState("Junho");
    const [reportYear, setReportYear] = useState("2025");
    const [studentType, setStudentType] = useState<'voluntario' | 'bolsista'>('bolsista');
    const [activityStartDate, setActivityStartDate] = useState('01/01/2025');
    const [activityEndDate, setActivityEndDate] = useState('31/12/2025');
    const [announcement, setAnnouncement] = useState('Edital IFTM Nº 01/2025');
    const [studentSignatureName, setStudentSignatureName] = useState('Fulano de Tal da Silva Sauro');

    const [html2pdf, setHtml2pdf] = useState<any>(null);

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

    const todayDate = new Date().toLocaleDateString('pt-BR');
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        if (contentRef.current && html2pdf) {
            const options = {
                margin: [5, 5, 5, 5],
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
            <button className="download-button" onClick={handleDownloadPdf} style={{ marginBottom: '20px' }} disabled={!html2pdf}>
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