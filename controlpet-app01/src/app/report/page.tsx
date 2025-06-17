// src/pages/main/relatorios/relatorio-mensal-pet.tsx
'use client'

import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

interface ReportPageProps {
    // Defina suas props aqui, se houver dados dinâmicos para o relatório.
}

const ReportPage: React.FC<ReportPageProps> = () => {
    const institutionPetGroup = "PET Computação Ituiutaba";
    const tutorName = "Ailton Luiz Dias Siqueira Junior";
    const todayDate = new Date().toLocaleDateString('pt-BR');

    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        if (contentRef.current) {
            // Configurações otimizadas para o PDF
            const options = {
                margin: [0, 0, 0, 0], // Remova todas as margens iniciais do PDF
                filename: 'relatorio_pet.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2, // Aumenta a resolução da captura HTML para imagem
                    useCORS: true, // Importante para carregar imagens de URLs externas, se houver
                    scrollY: 0, // Inicia a captura do topo do elemento
                    // Removido windowWidth: contentRef.current.scrollWidth
                    // A largura do c17 (210mm) já deve ser suficiente
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                }
            };

            // Cria um clone do elemento para evitar side effects visuais durante a geração
            const element = contentRef.current;
            const clonedElement = element.cloneNode(true) as HTMLElement;

            // Opcional: Remover o botão do clone se ele estiver dentro do contentRef (neste caso não está, mas é uma boa prática)
            // const button = clonedElement.querySelector('.download-button');
            // if (button) button.remove();

            html2pdf().from(clonedElement).set(options).save();
        }
    };

    const pageStyles = `
    @import url(https://themes.googleusercontent.com/fonts/css?kit=fpjTOVmNbO4Lz34iLyptLU5zdwzqyXAFhQ3EpAK6bTA);

    /* Estilos globais para reset e fontes */
    ol, ul { margin: 0; padding: 0; }
    table td, table th { padding: 0; }
    
    /* Estilos originais que não afetam a largura geral */
    .lst-kix_list_1-3>li:before { content: "-  " }
    .lst-kix_list_1-4>li:before { content: "-  " }
    ul.lst-kix_list_1-0 { list-style-type: none }
    .lst-kix_list_1-7>li:before { content: "-  " }
    .lst-kix_list_1-5>li:before { content: "-  " }
    .lst-kix_list_1-6>li:before { content: "-  " }
    ul.lst-kix_list_1-3 { list-style-type: none }
    .lst-kix_list_1-0>li:before { content: "-  " }
    ul.lst-kix_list_1-4 { list-style-type: none }
    .lst-kix_list_1-8>li:before { content: "-  " }
    ul.lst-kix_list_1-1 { list-style-type: none }
    ul.lst-kix_list_1-2 { list-style-type: none }
    ul.lst-kix_list_1-7 { list-style-type: none }
    .lst-kix_list_1-1>li:before { content: "-  " }
    .lst-kix_list_1-2>li:before { content: "-  " }
    ul.lst-kix_list_1-8 { list-style-type: none }
    ul.lst-kix_list_1-5 { list-style-type: none }
    ul.lst-kix_list_1-6 { list-style-type: none }
    
    /* Estilos de tabelas e células - Convertendo pt para mm quando relevante para largura/altura */
    /* 1pt = 0.352778mm */
    .c11 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        background-color: #d9d9d9;
        width: 82.3mm; /* 233.2pt * 0.352778 */
    }
    .c16 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        background-color: #d9d9d9;
        width: 167.4mm; /* 474.6pt * 0.352778 */
    }
    .c3 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 166.9mm; /* 473.2pt * 0.352778 */
    }
    .c15 {
        border-bottom: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 56.9mm; /* 161.3pt * 0.352778 */
    }
    .c24 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 82.3mm; /* 233.2pt * 0.352778 */
    }
    .c44 {
        border-bottom: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 105.7mm; /* 299.4pt * 0.352778 */
    }
    .c41 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 167.2mm; /* 473.9pt * 0.352778 */
    }
    .c49 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 167.4mm; /* 474.6pt * 0.352778 */
    }
    .c25 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 167.4mm; /* 474.6pt * 0.352778 */
    }
    .c46 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 84.7mm; /* 240pt * 0.352778 */
    }
    .c40 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        width: 78.0mm; /* 221.2pt * 0.352778 */
    }
    .c42 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: middle;
        background-color: #d9d9d9;
        width: 167.2mm; /* 473.9pt * 0.352778 */
    }
    .c47 {
        border: 1pt solid #000000;
        padding: 0pt 5.4pt;
        vertical-align: top;
        width: 78.0mm; /* 221.2pt * 0.352778 */
    }

    /* Estilos de texto */
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

    /* Estilos de parágrafo e alinhamento */
    .c2 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: center }
    .c35 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.5; orphans: 2; widows: 2; text-align: center }
    .c9 { padding-top: 0pt; padding-bottom: 3pt; line-height: 1.1500000000000001; orphans: 2; widows: 2; text-align: center }
    .c4 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: left }
    .c36 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.5; orphans: 2; widows: 2; text-align: left }
    .c48 { padding-top: 18pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: center }
    .c28 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.1500000000000001; text-align: left }
    .c19 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.15; text-align: left }
    .c50 { margin-left: 216pt; text-indent: 36pt }

    /* Estilos de borda e cor */
    .c0 { margin-left: -5.4pt; border-spacing: 0; border-collapse: collapse; margin-right: auto }
    .c30 { border-top: 0.5pt solid #000000; }
    .c32 { background-color: #d9d9d9 }

    /* Alturas de linha/celda - Convertendo pt para mm quando relevante */
    .c43 { height: 19.8mm; } /* 56.2pt * 0.352778 */
    .c5 { height: 4.2mm; }    /* 12pt * 0.352778 */
    .c21 { height: 7.3mm; }   /* 20.8pt * 0.352778 */
    .c39 { height: 7.4mm; }   /* 21pt * 0.352778 */
    .c45 { height: 2.7mm; }   /* 7.8pt * 0.352778 */
    .c1 { height: 30.9mm; }   /* 87.8pt * 0.352778 */
    .c7 { height: 0mm; }      /* Altura 0pt */
    .c37 { height: 7.3mm; }   /* 20.6pt * 0.352778 */
    .c31 { height: 32.3mm; }  /* 91.6pt * 0.352778 */
    .c18 { height: 4.8mm; }   /* 13.7pt * 0.352778 */


    /* PRINCIPAIS AJUSTES PARA O LAYOUT A4 NO NAVEGADOR E PDF */
    .c17 {
        background-color: #ffffff;
        width: 210mm;      /* Largura de uma folha A4 */
        min-height: 297mm; /* Altura mínima de uma folha A4. Importante para o html2canvas */
        margin: 0 auto;    /* Centraliza na tela */
        padding: 15mm;     /* Margem interna do conteúdo na folha A4 */
        box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Sombra para simular uma folha na tela */
        box-sizing: border-box; /* Garante que padding e borda estejam inclusos na largura/altura */
        display: block;    /* Garante que se comporte como um bloco padrão de documento */
        text-align: initial; /* Reseta o alinhamento de texto que pode ser herdado */
        position: relative; /* Pode ser útil para posicionamentos absolutos internos */
    }

    /* Estilos para o corpo da página (visualização no navegador) */
    body {
        display: flex;
        flex-direction: column; /* Organiza o botão acima do "A4" */
        justify-content: flex-start; /* Alinha o conteúdo ao topo */
        align-items: center; /* Centraliza horizontalmente o "A4" e o botão */
        min-height: 100vh;
        background-color: #f0f0f0;
        margin: 0;
        padding-top: 20px; /* Espaço do topo até o botão */
        padding-bottom: 40px; /* Espaço abaixo da página A4 */
        overflow-y: auto; /* Permite scroll se o conteúdo for maior que a tela */
    }

    /* Estilos para o botão de download */
    .download-button {
        margin-bottom: 20px; /* Espaço entre o botão e o documento A4 */
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

    /* Regras específicas para impressão e PDF */
    @media print {
        body {
            /* Remova padding e background do body na impressão */
            background-color: transparent;
            padding-top: 0;
            padding-bottom: 0;
            margin: 0; /* Garante margem zero no body */
        }
        .download-button {
            display: none; /* Oculta o botão no PDF */
        }
        /* Esta regra é fundamental para o PDF e para impressão */
        @page {
            margin: 0; /* Margem zero na página do PDF */
            size: A4;  /* Define o tamanho da página como A4 */
        }
        .c17 {
            box-shadow: none; /* Remove a sombra no PDF para parecer uma folha impressa */
            margin: 0; /* Garante que não haja margem extra no elemento capturado */
            min-height: 297mm; /* Essencial para que o html2canvas capture a altura total */
            height: auto; /* Deixa a altura ser definida pelo conteúdo */
        }
    }
    `;

    return (
        <>
            {/* Aplica os estilos globalmente */}
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

            {/* Botão de Download */}
            <button className="download-button" onClick={handleDownloadPdf}>
                Download PDF
            </button>

            {/* Div que contém o conteúdo do relatório no formato A4 */}
            <div className="c17 doc-content" ref={contentRef}>
                <div>
                    <p className="c5 c28"><span className="c20"></span></p>
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
                                            width: '188.98px', // Aproximadamente 66.6mm
                                            height: '52.04px', // Aproximadamente 18.3mm
                                        }}>
                                            <img
                                                alt="Horizontal resumida.png"
                                                src="/image1.png" // Verifique o caminho da imagem no seu projeto Next.js (pasta 'public')
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
                <p className="c9">
                    <span className="c6">Mês: </span>
                    <span className="c14">&nbsp;</span>
                    <span className="c6">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Ano:</span>
                    <span className="c26 c23 c38">&nbsp; &nbsp; &nbsp;</span>
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
                                <p className="c36"><span className="c23">Estudante: </span></p>
                            </td>
                            <td className="c24" colSpan={1} rowSpan={1}>
                                <p className="c35"><span className="c23 c26">PERÍODO DE ATIVIDADES</span></p>
                                <p className="c5 c35"><span className="c13"></span></p>
                            </td>
                        </tr>
                        <tr className="c7">
                            <td className="c3" colSpan={2} rowSpan={1}>
                                <p className="c36"><span className="c23">Nome:</span><span>&nbsp;</span></p>
                            </td>
                        </tr>
                        <tr className="c7">
                            <td className="c3" colSpan={2} rowSpan={1}>
                                <p className="c36"><span className="c6">Curso: </span></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="c4 c5"><span className="c8"></span></p>
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
                                <p className="c4"><span className="c14">Edital: </span></p>
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
                                <p className="c4 c5"><span className="c8"></span></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                                <p className="c4 c5"><span className="c8"></span></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="c48"><span className="c33">ENTREGAR ATÉ O 5º DIA DE CADA MÊS</span></p>
                <p className="c2"><span className="c8">Data hoje: {todayDate}</span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c2">
                    <span className="c29">Assinatura do aluno&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp; &nbsp; Assinatura do orientador</span>
                </p>
                <p className="c4">
                    <span className="c8">______________________________ &nbsp; &nbsp; &nbsp; ______________________________</span>
                </p>
                <p className="c4">
                    <span className="c8">
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        &nbsp;Aluno &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Orientador
                    </span>
                </p>
                <p className="c4 c50"><span className="c8">Ailton Luiz Siqueira Junior</span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c4 c5"><span className="c8"></span></p>
                <p className="c2"><span className="c20">Assinatura eletrônica via Docs no Virtual IF</span></p>
                <div>
                    <p className="c2 c30">
                        <span className="c27">AV Doutor Randolfo Borges Junior 2900 &ndash; Univerdecidade- Uberaba (MG) - CEP: 38.064-200</span>
                    </p>
                    <p className="c2 c30">
                        <span className="c27">Fones: (034) 3326-1121 / Fax: (034) 3326-1101</span>
                    </p>
                    <p className="c4 c5"><span className="c13"></span></p>
                </div>
            </div>
        </>
    );
};

export default ReportPage;