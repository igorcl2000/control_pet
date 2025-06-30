import React from 'react';

// Define as props que o componente do template irá receber
interface A4ReportTemplateProps {
    institutionPetGroup: string;
    tutorName: string;
    todayDate: string;
    studentName?: string;
    studentCourse?: string;
    activitiesSummary?: string;
    petitionerComments?: string;
    reportMonth?: string;
    reportYear?: string;
    studentType?: string; // Novo: Tipo de estudante
    activityStartDate?: string; // Novo: Data de início das atividades
    activityEndDate?: string; // Novo: Data de fim das atividades
    announcement?: string; // Novo: Campo para o Edital
    studentSignatureName?: string; // Novo: Nome do aluno para a assinatura
    // NOVAS PROPS PARA A AVALIAÇÃO DO TUTOR
    tutorCargaHoraria?: 'RUIM' | 'REGULAR' | 'BOM' | 'ÓTIMO' | '';
    tutorInteresseAtividades?: 'RUIM' | 'REGULAR' | 'BOM' | 'ÓTIMO' | '';
    tutorHabilidadesDesenvolvidas?: 'RUIM' | 'REGULAR' | 'BOM' | 'ÓTIMO' | '';
    tutorOutrasInformacoes?: string;
}

// Função Auxiliar para Quebras de Linha
// CORREÇÃO: Aceita uma classe extra para aplicar estilos específicos.
const formatTextWithLineBreaks = (text: string | undefined, extraClassName: string = ""): React.ReactNode => {
    const safeText = text || '';
    const finalClassName = `c8 ${extraClassName}`.trim(); // Combina a classe padrão c8 com a classe extra
    return <div className={finalClassName} dangerouslySetInnerHTML={{ __html: safeText.replace(/\n/g, '<br />') }} />;
};

const A4ReportTemplate: React.FC<A4ReportTemplateProps> = ({
    institutionPetGroup,
    tutorName,
    todayDate,
    studentName = '',
    studentCourse = '',
    activitiesSummary = '',
    petitionerComments = '',
    reportMonth = '',
    reportYear = '',
    studentType = '', // Novo
    activityStartDate = '', // Novo
    activityEndDate = '', // Novo
    announcement = '', // Novo
    studentSignatureName = '', // Novo
    // NOVAS PROPS
    tutorCargaHoraria = '',
    tutorInteresseAtividades = '',
    tutorHabilidadesDesenvolvidas = '',
    tutorOutrasInformacoes = ''
}) => {
    // Função auxiliar para marcar a opção correta
    const getCheckedMark = (value: string, option: string) => {
        return value.toUpperCase() === option.toUpperCase() ? 'X' : ' ';
    };

    const pageStyles = `
    @import url(https://themes.googleusercontent.com/fonts/css?kit=fpjTOVmNbO4Lz34iLyLyptLU5zdwzqyXAFhQ3EpAK6bTA);

    ol, ul { margin: 0; padding: 0; }
    table td, table th { padding: 0; }
    
    .lst-kix_list_1-3>li:before { content: "-  " }
    .lst-kix_list_1-4>li:before { content: "-  " }
    ul.lst-kix_list_1-0 { list-style-type: none }
    .lst-kix_list_1-7>li:before { content: "-  " }
    .lst-kix_list_1-5>li:before { content: "-  " }
    .lst-kix_list_1-6>li:before { content: "-  " }
    ul.lst-kix_list_1-3 { list-style-type: none }
    .lst-kix_list_1-0>li:before { content: "-  " }
    ul.lst-kix_list_1-4 { list-style-type: none }
    .lst-kix_list_1-1>li:before { content: "-  " }
    ul.lst-kix_list_1-2 { list-style-type: none }
    ul.lst-kix_list_1-7 { list-style-type: none }
    .lst-kix_list_1-1>li:before { content: "-  " }
    .lst-kix_list_1-2>li:before { content: "-  " }
    ul.lst-kix_list_1-8 { list-style-type: none }
    ul.lst-kix_list_1-5 { list-style-type: none }
    ul.lst-kix_list_1-6 { list-style-type: none }

    @media print {
        .force-new-page {
            page-break-before: always; /* Legacy property */
            break-before: page; /* Modern property */
        }

        /* Classe para o rodapé que deve ficar no final da última página */
        .final-footer {
            margin-top: auto; /* Isso empurrará a div para o final do seu container flex */
        }
    }
    
    .c11 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        background-color: #d9d9d9;
        width: 82.3mm;
    }
    .c16 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        background-color: #d9d9d9;
        width: 167.4mm;
    }
    .c3 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 166.9mm;
    }
    .c15 {
        border-bottom: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 56.9mm;
    }
    .c24 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 82.3mm;
    }
    .c44 {
        border-bottom: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 105.7mm;
    }
    .c41 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 167.2mm;
        /* height: auto; */
    }
    .c49 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 167.4mm;
        /* REMOVIDO: max-height e outras propriedades de altura/overflow do .c49 para evitar conflitos, pois controlaremos o elemento interno */
    }
    .c25 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 167.4mm;
    }
    .c46 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 84.7mm;
    }
    .c40 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 78.0mm;
    }
    .c42 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        background-color: #d9d9d9;
        width: 167.2mm;
    }
    .c47 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 78.0mm;
    }

    /* NOVAS CLASSES PARA A AVALIAÇÃO DO TUTOR */
    .c51 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        background-color: #d9d9d9;
        width: 167.4mm; /* Largura total da tabela de avaliação */
    }
    .c52 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        height: 7.3mm; /* Altura padrão para linhas de avaliação */
    }
    .c53 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 110.0mm; /* Largura para a descrição da avaliação */
    }
    .c54 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 57.0mm; /* Largura para as opções de Ruim/Regular/Bom/Ótimo */
        white-space: nowrap; /* Evita que o texto quebre em várias linhas */
    }

    .c10 { -webkit-text-decoration-skip: none; color: #000000; font-weight: 700; text-decoration: underline; vertical-align: baseline; text-decoration-skip-ink: none; font-size: 12pt; font-family: "Arial"; font-style: normal }
    .c27 { color: #000000; font-weight: 400; text-decoration: none; vertical-align: baseline; font-size: 9pt; font-family: "Calibri"; font-style: normal }
    .c6 { color: #000000; font-weight: 700; text-decoration: none; vertical-align: baseline; font-size: 11pt; font-family: "Arial"; font-style: normal }
    .c12 { color: #000000; font-weight: 400; text-decoration: none; vertical-align: baseline; font-size: 10pt; font-family: "Arial"; font-style: normal }
    .c8 { color: #000000; font-weight: 400; text-decoration: none; vertical-align: baseline; font-size: 12pt; font-family: "Arial"; font-style: normal }
    .c29 { color: #000000; font-weight: 400; font-size: 8pt; font-family: "Arial"; font-style: italic }
    .c22 { color: #000000; font-weight: 700; text-decoration: none; vertical-align: baseline; font-size: 12pt; font-family: "Arial"; font-style: normal }
    .c20 { color: #ff0000; font-weight: 400; text-decoration: none; vertical-align: baseline; font-size: 12pt; font-family: "Arial"; font-style: normal }
    .c13 { color: #000000; font-weight: 400; text-decoration: none; vertical-align: baseline; font-size: 12pt; font-family: "Times New Roman"; font-style: normal }
    .c34 { color: #000000; text-decoration: none; vertical-align: baseline; font-size: 9pt; font-style: normal }
    .c26 { text-decoration-skip-ink: none; -webkit-text-decoration-skip: none; text-decoration: underline }
    .c14 { font-size: 11pt; font-weight: 400; font-family: "Arial" }
    .c23 { font-size: 11pt; font-weight: 700; font-family: "Arial" }
    .c38 { color: #000000; vertical-align: baseline; font-style: normal }
    .c33 { font-weight: 700; font-family: "Arial" }
    .title { padding-top: 24pt; color: #000000; font-weight: 700; font-size: 36pt; padding-bottom: 6pt; font-family: "Times New Roman"; line-height: 1.0; page-break-after: avoid; orphans: 2; widows: 2; text-align: left }
    .subtitle { padding-top: 18pt; color: #666666; font-size: 24pt; padding-bottom: 4pt; font-family: "Georgia"; line-height: 1.0; page-break-after: avoid; font-style: italic; orphans: 2; widows: 2; text-align: left }
    li { color: #000000; font-size: 12pt; font-family: "Times New Roman" }
    p { margin: 0; color: #000000; font-size: 12pt; font-family: "Times New Roman" }
    h1 { padding-top: 24pt; color: #366091; font-weight: 700; font-size: 14pt; padding-bottom: 0pt; font-family: "Cambria"; line-height: 1.0; page-break-after: avoid; orphans: 2; widows: 2; text-align: left }
    h2 { padding-top: 18pt; color: #000000; font-weight: 700; font-size: 18pt; padding-bottom: 4pt; font-family: "Times New Roman"; line-height: 1.0; page-break-after: avoid; orphans: 2; widows: 2; text-align: left }
    h3 { padding-top: 14pt; color: #000000; font-weight: 700; font-size: 14pt; padding-bottom: 4pt; font-family: "Times New Roman"; line-height: 1.0; page-break-after: avoid; orphans: 2; widows: 2; text-align: left }
    h4 { padding-top: 12pt; color: #000000; font-weight: 700; font-size: 12pt; padding-bottom: 2pt; font-family: "Times New Roman"; line-height: 1.0; page-break-after: avoid; orphans: 2; widows: 2; text-align: left }
    h5 { padding-top: 11pt; color: #000000; font-weight: 700; font-size: 11pt; padding-bottom: 2pt; font-family: "Times New Roman"; line-height: 1.0; page-break-after: avoid; orphans: 2; widows: 2; text-align: left }
    h6 { padding-top: 10pt; color: #000000; font-weight: 700; font-size: 10pt; padding-bottom: 2pt; font-family: "Times New Roman"; line-height: 1.0; page-break-after: avoid; orphans: 2; widows: 2; text-align: left }

    .c2 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: center }
    .c35 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.5; orphans: 2; widows: 2; text-align: center }
    .c9 { padding-top: 0pt; padding-bottom: 3pt; line-height: 1.1500000000000001; orphans: 2; widows: 2; text-align: center }
    .c4 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: left }
    .c36 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.5; orphans: 2; widows: 2; text-align: left }
    .c48 { padding-top: 18pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: center }
    .c28 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.1500000000000001; text-align: left }
    .c19 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.15; text-align: left }
    .c50 { margin-left: 216pt; text-indent: 36pt }

    .c0 {
    border-spacing: 0;
    border-collapse: collapse;
    margin: 0 auto;
    width: 90%;
    table-layout: fixed; /* CORREÇÃO: Adicionado para layout de tabela fixo */
    }
    
    .c30 { border-top: 0.5pt solid #000000; }
    .c32 { background-color: #d9d9d9 }

    .c43 { height: 19.8mm; }
    .c5 { height: 4.2mm; }
    .c21 { height: 7.3mm; }
    .c39 { height: 7.4mm; }
    .c45 { height: 2.7mm; }
    /* REMOVER a altura fixa ou min-height da linha da tabela (.c1 e .c31) se elas estão impedindo o auto-ajuste */
    /* Deixe a altura ser controlada pelo conteúdo da célula (td) */
    .c1 { 
        height: 80mm;
     }
    .c31 { height: 80mm; }
    .c7 { height: 0mm; }
    .c37 { height: 7.3mm; }
    .c18 { height: 4.8mm; }


    .c17 {
        background-color: #ffffff;
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 10mm;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
        display: block;
        text-align: initial;
        position: relative;
    }

    /* CORREÇÃO: Nova classe para o box de conteúdo do resumo de atividades */
    .activities-summary-box {
        height: 80mm /* Faz com que o div preencha a altura da célula da tabela */
        overflow: hidden; /* Corta o conteúdo que exceder a altura */
        display: block; /* Garante que o div se comporte como um bloco para respeitar height/overflow */
        padding: 0; /* Remove padding padrão se houver */
        margin: 0; /* Remove margin padrão se houver */
    }

    body {
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        min-height: 100vh;
        background-color: #f0f0f0;
        margin: 0;
        padding-bottom: 40px;
        overflow-y: auto;
    }

    .download-button {
        margin-bottom: 20px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    .download-button:hover {
        background-color: #0056b3;
    }

    @media print {
        body {
            background-color: transparent;
            padding-top: 0;
            padding-bottom: 0;
            margin: 0;
        }
        .download-button {
            display: none;
        }
        @page {
            margin: 0;
            size: A4;
        }
        .c17 {
            box-shadow: none;
            margin: 0;
            min-height: 297mm;
            height: auto;
        }
    }
    `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
            <div className="c17 doc-content">
                <div>
                    <p className="c28"><span className="c20"></span></p>
                    <table className="c0">
                        <tbody>
                            <tr className="c43">
                                <td className="c15" colSpan={1} rowSpan={1}>
                                    <p className="c2">
                                        <span style={{
                                            overflow: 'hidden',
                                            display: 'inline-block',
                                            margin: '0.00px 0.00px',
                                            border: '0.00px solid #000000',
                                            transform: 'rotate(0.00rad) translateZ(0px)',
                                            WebkitTransform: 'rotate(0.00rad) translateZ(0px)',
                                            width: '188.98px',
                                            height: '52.04px',
                                        }}>
                                            <img
                                                alt="Horizontal resumida.png"
                                                src="/image1.png"
                                                style={{
                                                    width: '188.98px',
                                                    height: '52.04px',
                                                    marginLeft: '-0.00px',
                                                    marginTop: '-0.00px',
                                                    transform: 'rotate(0.00rad) translateZ(0px)',
                                                    WebkitTransform: 'rotate(0.00rad) translateZ(0px)',
                                                }}
                                                title="Horizontal resumida.png"
                                            />
                                        </span>
                                    </p>
                                </td>
                                <td className="c44" colSpan={1} rowSpan={1}>
                                    <p className="c2"><span className="c12">MINISTÉRIO DA EDUCAÇÃO</span></p>
                                    <p className="c2"><span className="c33 c34">INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA</span></p>
                                    <p className="c2"><span className="c34 c33">E TECNOLOGIA DO TRIÂNGULO MINEIRO</span></p>
                                    <p className="c2"><span className="c12">Pró-reitoria de Ensino</span></p>
                                    <p className="c2"><span className="c12">Pró-reitoria de Extensão e Cultura</span></p>
                                    <p className="c2"><span className="c12">Pró-Reitoria de Pesquisa, Pós-graduação e Inovação</span></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="c4 c5"><span className="c13"></span></p>
                </div>
                <p className="c4 c5"><span className="c13"></span></p>
                <p style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <span className="c6">Mês: {reportMonth}</span>
                    <span className="c6">Ano: {reportYear}</span>
                </p>
                <p className="c4 c5"><span className="c8"></span></p>
                <table className="c0">
                    <thead>
                        <tr className="c7">
                            <td className="c3 c32" colSpan={2} rowSpan={1}>
                                <p className="c2"><span className="c22">DADOS DO ESTUDANTE</span></p>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="c21">
                            <td className="c46" colSpan={1} rowSpan={1}>
                                <p className="c36">
                                    <span className="c23">Estudante: </span>
                                    <span className="c14">
                                        ( {studentType && studentType.toLowerCase() === 'bolsista' ? 'X' : ' '} ) Bolsista
                                    </span>
                                </p>
                                <p className="c36">
                                    <span className="c23">Estudante: </span>
                                    <span className="c14">
                                        ( {studentType && studentType.toLowerCase() === 'voluntário' ? 'X' : ' '} ) Voluntário
                                    </span>
                                </p>
                            </td>
                            <td className="c24" colSpan={1} rowSpan={1}>
                                <p className="c35"><span className="c23 c26">PERÍODO DE ATIVIDADES</span></p>
                                <p className="c35">
                                    <span className="c13">
                                        {activityStartDate && activityEndDate
                                            ? `${activityStartDate} a ${activityEndDate}`
                                            : ''}
                                    </span>
                                </p>
                            </td>
                        </tr>
                        <tr className="c7">
                            <td className="c3" colSpan={2} rowSpan={1}>
                                <p className="c36"><span className="c23">Nome:</span><span className="c14"> {studentName}</span></p>
                            </td>
                        </tr>
                        <tr className="c7">
                            <td className="c3" colSpan={2} rowSpan={1}>
                                <p className="c36"><span className="c6">Curso:</span><span className="c14"> {studentCourse}</span></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="c4 c5"><span className="c8"></span></p>
                {/* DADOS DO GRUPO PET INSTITUCIONAL */}
                <table className="c0">
                    <thead>
                        <tr className="c18">
                            <td className="c16" colSpan={1} rowSpan={1}>
                                <p className="c2"><span className="c22">DADOS DO GRUPO PET INSTITUCIONAL</span></p>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="c39">
                            <td className="c25" colSpan={1} rowSpan={1}>
                                <p className="c4">
                                    <span className="c14">Grupo PET Institucional: {institutionPetGroup}</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="c37">
                            <td className="c25" colSpan={1} rowSpan={1}>
                                <p className="c4"><span className="c14">Edital: {announcement}</span></p>
                            </td>
                        </tr>
                        <tr className="c37">
                            <td className="c25" colSpan={1} rowSpan={1}>
                                <p className="c4">
                                    <span className="c14">Tutor: {tutorName}</span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="c4 c5"><span className="c8"></span></p>
                {/* AVALIAÇÃO DO TUTOR SOBRE O PETIANO */}
                <table className="c0">
                    <thead>
                        <tr className="c18">
                            <td className="c16" colSpan={2} rowSpan={1}>
                                <p className="c2"><span className="c22">AVALIAÇÃO DO TUTOR SOBRE O PETIANO</span></p>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="c52">
                            <td className="c53" colSpan={1} rowSpan={1}>
                                <p className="c4"><span className="c14">1 - Cumprimento de Carga Horária: &nbsp; &nbsp;20 horas semanais.</span></p>
                            </td>
                            <td className="c54" colSpan={1} rowSpan={1}>
                                <p className="c4" style={{ textAlign: 'left' }}>
                                    <span className="c14">
                                        ( {tutorCargaHoraria === 'RUIM' ? 'X' : ''} ) Ruim
                                        &nbsp;
                                        ( {tutorCargaHoraria === 'REGULAR' ? 'X' : ''} ) Regular
                                        &nbsp;
                                        ( {tutorCargaHoraria === 'BOM' ? 'X' : ''} ) Bom
                                        &nbsp;
                                        ( {tutorCargaHoraria === 'ÓTIMO' ? 'X' : ''} ) Ótimo
                                    </span>
                                </p>
                            </td>
                        </tr>
                        <tr className="c52">
                            <td className="c53" colSpan={1} rowSpan={1}>
                                <p className="c4"><span className="c14">2 - Interesse nas atividades de ensino, pesquisa e extensão:</span></p>
                            </td>
                            <td className="c54" colSpan={1} rowSpan={1}>
                                <p className="c4" style={{ textAlign: 'left' }}>
                                    <span className="c14">
                                        ( {tutorInteresseAtividades === 'RUIM' ? 'X' : ''} ) Ruim
                                        &nbsp;
                                        ( {tutorInteresseAtividades === 'REGULAR' ? 'X' : ''} ) Regular
                                        &nbsp;
                                        ( {tutorInteresseAtividades === 'BOM' ? 'X' : ''} ) Bom
                                        &nbsp;
                                        ( {tutorInteresseAtividades === 'ÓTIMO' ? 'X' : ''} ) Ótimo
                                    </span>
                                </p>
                            </td>
                        </tr>
                        <tr className="c52">
                            <td className="c53" colSpan={1} rowSpan={1}>
                                <p className="c4"><span className="c14">3-Habilidades desenvolvidas: </span><span className="c28 c29">(autonomia, espírito crítico, criatividade, conhecimento de métodos e técnicas de pesquisa, uso de outras línguas, etc)</span></p>
                            </td>
                            <td className="c54" colSpan={1} rowSpan={1}>
                                <p className="c4" style={{ textAlign: 'left' }}>
                                    <span className="c14">
                                        ( {tutorHabilidadesDesenvolvidas === 'RUIM' ? 'X' : ''} ) Ruim
                                        &nbsp;
                                        ( {tutorHabilidadesDesenvolvidas === 'REGULAR' ? 'X' : ''} ) Regular
                                        &nbsp;
                                        ( {tutorHabilidadesDesenvolvidas === 'BOM' ? 'X' : ''} ) Bom
                                        &nbsp;
                                        ( {tutorHabilidadesDesenvolvidas === 'ÓTIMO' ? 'X' : ''} ) Ótimo
                                    </span>
                                </p>
                            </td>
                        </tr>
                        <tr className="c39">
                            <td className="c41" colSpan={2} rowSpan={1}>
                                <p className="c4"><span className="c14">4 - Outras informações:</span></p>
                                {/* O 'tutorOutrasInformacoes' também pode se beneficiar de um box fixo se o conteúdo for longo */}
                                {formatTextWithLineBreaks(tutorOutrasInformacoes, "activities-summary-box")}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="c4 c5"><span className="c8"></span></p>
                {/* FIM DO NOVO MÓDULO */}

                <table className="c0">
                    <thead>
                        <tr className="c18">
                            <td className="c16" colSpan={2} rowSpan={1}>
                                <p className="c2"><span className="c22">RESUMOS DAS ATIVIDADES DESENVOLVIDAS NO MÊS</span></p>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="c1">
                            <td className="c49" colSpan={2} rowSpan={1}>
                                {/* CORREÇÃO: Passando a nova classe para o div de conteúdo */}
                                {formatTextWithLineBreaks(activitiesSummary, "activities-summary-box")}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="c4 c5"><span className="c8"></span></p>
                <div>
                    <p className="c2 c30">
                        <span className="c27">AV Doutor Randolfo Borges Junior 2900 – Univerdecidade- Uberaba (MG) - CEP: 38.064-200</span>
                    </p>
                    <p className="c2 c30">
                        <span className="c27">Fones: (034) 3326-1121 / Fax: (034) 3326-1101</span>
                    </p>
                </div>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5 force-new-page"><span className="c8"></span></p>
                <div>
                    <p className="c28"><span className="c20"></span></p>
                    <table className="c0">
                        <tbody>
                            <tr className="c43">
                                <td className="c15" colSpan={1} rowSpan={1}>
                                    <p className="c2">
                                        <span style={{
                                            overflow: 'hidden',
                                            display: 'inline-block',
                                            margin: '0.00px 0.00px',
                                            border: '0.00px solid #000000',
                                            transform: 'rotate(0.00rad) translateZ(0px)',
                                            WebkitTransform: 'rotate(0.00rad) translateZ(0px)',
                                            width: '188.98px',
                                            height: '52.04px',
                                        }}>
                                            <img
                                                alt="Horizontal resumida.png"
                                                src="/image1.png"
                                                style={{
                                                    width: '188.98px',
                                                    height: '52.04px',
                                                    marginLeft: '-0.00px',
                                                    marginTop: '-0.00px',
                                                    transform: 'rotate(0.00rad) translateZ(0px)',
                                                    WebkitTransform: 'rotate(0.00rad) translateZ(0px)',
                                                }}
                                                title="Horizontal resumida.png"
                                            />
                                        </span>
                                    </p>
                                </td>
                                <td className="c44" colSpan={1} rowSpan={1}>
                                    <p className="c2"><span className="c12">MINISTÉRIO DA EDUCAÇÃO</span></p>
                                    <p className="c2"><span className="c33 c34">INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA</span></p>
                                    <p className="c2"><span className="c34 c33">E TECNOLOGIA DO TRIÂNGULO MINEIRO</span></p>
                                    <p className="c2"><span className="c12">Pró-reitoria de Ensino</span></p>
                                    <p className="c2"><span className="c12">Pró-reitoria de Extensão e Cultura</span></p>
                                    <p className="c2"><span className="c12">Pró-Reitoria de Pesquisa, Pós-graduação e Inovação</span></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="c4 c5"><span className="c13"></span></p>
                </div>
                <p className="c4 c5"><span className="c8"></span></p>
                <table className="c0">
                    <thead>
                        <tr className="c45">
                            <td className="c32 c42" colSpan={1} rowSpan={1}>
                                <p className="c2"><span className="c22">COMENTÁRIOS E DIFICULDADES DO PETIANO SOBRE A PROPOSTA</span></p>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="c31">
                            <td className="c41" colSpan={1} rowSpan={1}>
                                {/* CORREÇÃO: Passando a nova classe para o div de conteúdo */}
                                {formatTextWithLineBreaks(petitionerComments, "activities-summary-box")}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="c48"><span className="c33">ENTREGAR ATÉ O 5º DIA DE CADA MÊS</span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c2"><span className="c8">Ituiutaba, {todayDate}</span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '30pt' }}>
                    {/* Coluna do Aluno */}
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '150px', maxWidth: '250px', margin: '0 10mm' }}> {/* Ajustado minWidth, maxWidth e margin */}
                        <p className="c2">
                            <span className="c29">Assinatura do aluno</span>
                        </p>
                        <p className="c4">
                            <span className="c8">______________________________</span>
                        </p>
                        <p className="c2">
                            <span className="c8">Aluno</span>
                        </p>
                        <p className="c2">
                            <span className="c8">{studentSignatureName}</span>
                        </p>
                    </div>

                    {/* Coluna do Orientador */}
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '150px', maxWidth: '250px', margin: '0 10mm' }}> {/* Ajustado minWidth, maxWidth e margin */}
                        <p className="c2">
                            <span className="c29">Assinatura do orientador</span>
                        </p>
                        <p className="c4">
                            <span className="c8">______________________________</span>
                        </p>
                        <p className="c2">
                            <span className="c8">Orientador</span>
                        </p>
                        <p className="c2">
                            <span className="c8">{tutorName}</span>
                        </p>
                    </div>
                </div>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c2"><span className="c20">Assinatura eletrônica via Docs no Virtual IF</span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>

                <div id="final-footer" className="final-footer">
                    <p className="c2 c30">
                        <span className="c27">AV Doutor Randolfo Borges Junior 2900 – Univerdecidade- Uberaba (MG) - CEP: 38.064-200</span>
                    </p>
                    <p className="c2 c30">
                        <span className="c27">Fones: (034) 3326-1121 / Fax: (034) 3326-1101</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default A4ReportTemplate;