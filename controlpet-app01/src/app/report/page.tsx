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
                    windowWidth: contentRef.current.scrollWidth // Garante que a largura da janela de captura é a largura do conteúdo
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

            // Opcional: Remover o botão do clone se ele estiver dentro do contentRef (neste caso não está)
            // const button = clonedElement.querySelector('.download-button');
            // if (button) button.remove();

            html2pdf().from(clonedElement).set(options).save();
        }
    };

    const pageStyles = `
    @import url(https://themes.googleusercontent.com/fonts/css?kit=fpjTOVmNbO4Lz34iLyptLU5zdwzqyXAFhQ3EpAK6bTA);

    /* Estilos originais que não afetam a largura geral */
    .lst-kix_list_1-3>li:before { content: "-  " }
    .lst-kix_list_1-4>li:before { content: "-  " }
    ul.lst-kix_list_1-0 { list-style-type: none }
    .lst-kix_list_1-7>li:before { content: "-  " }
    .lst-kix_list_1-5>li:before { content: "-  " }
    .lst-kix_list_1-6>li:before { content: "-  " }
    ul.lst-kix_list_1-3 { list-style-type: none }
    .lst-kix_list_1-0>li:before { content: "-  " }
    ul.lst-kix_list_1-4 { list-style-type: none }
    .lst-kix_list_1-8>li:before { content: "-  " }
    ul.lst-kix_list_1-1 { list-style-type: none }
    ul.lst-kix_list_1-2 { list-style-type: none }
    ul.lst-kix_list_1-7 { list-style-type: none }
    .lst-kix_list_1-1>li:before { content: "-  " }
    .lst-kix_list_1-2>li:before { content: "-  " }
    ul.lst-kix_list_1-8 { list-style-type: none }
    ul.lst-kix_list_1-5 { list-style-type: none }
    ul.lst-kix_list_1-6 { list-style-type: none }
    ol { margin: 0; padding: 0 }
    table td, table th { padding: 0 }
    .c11 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; background-color: #d9d9d9; border-left-style: solid; border-bottom-width: 1pt; width: 233.2pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c16 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; background-color: #d9d9d9; border-left-style: solid; border-bottom-width: 1pt; width: 474.6pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c3 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 473.2pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c15 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 0pt; border-right-width: 0pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 0pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 161.3pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c24 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 233.2pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c44 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 0pt; border-right-width: 0pt; border-left-color: #000000; vertical-align: top; border-right-color: #000000; border-left-width: 0pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 299.4pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c41 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: top; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 473.9pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c49 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: top; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 474.6pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c25 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 474.6pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c46 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 240pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c40 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 221.2pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c42 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: middle; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 473.9pt; border-top-color: #000000; border-bottom-style: solid
    }
    .c47 {
        border-right-style: solid; padding: 0pt 5.4pt 0pt 5.4pt; border-bottom-color: #000000; border-top-width: 1pt; border-right-width: 1pt; border-left-color: #000000; vertical-align: top; border-right-color: #000000; border-left-width: 1pt; border-top-style: solid; border-left-style: solid; border-bottom-width: 1pt; width: 221.2pt; border-top-color: #000000; border-bottom-style: solid
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
    .c2 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: center }
    .c35 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.5; orphans: 2; widows: 2; text-align: center }
    .c9 { padding-top: 0pt; padding-bottom: 3pt; line-height: 1.1500000000000001; orphans: 2; widows: 2; text-align: center }
    .c4 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: left }
    .c36 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.5; orphans: 2; widows: 2; text-align: left }
    .c48 { padding-top: 18pt; padding-bottom: 0pt; line-height: 1.0; orphans: 2; widows: 2; text-align: center }
    .c34 { color: #000000; text-decoration: none; vertical-align: baseline; font-size: 9pt; font-style: normal }
    .c0 { margin-left: -5.4pt; border-spacing: 0; border-collapse: collapse; margin-right: auto }
    .c28 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.1500000000000001; text-align: left }
    .c19 { padding-top: 0pt; padding-bottom: 0pt; line-height: 1.15; text-align: left }
    .c26 { text-decoration-skip-ink: none; -webkit-text-decoration-skip: none; text-decoration: underline }
    .c14 { font-size: 11pt; font-weight: 400; font-family: "Arial" }
    /* Ajustes para o layout A4 */
    .c17 {
        background-color: #ffffff;
        width: 210mm; /* Largura de uma folha A4 */
        /* Remova o margin-top e bottom para que o conteúdo comece imediatamente */
        margin: 0 auto; /* Centraliza na página horizontalmente */
        padding: 15mm; /* Padding interno para o conteúdo */
        box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Sombra para simular uma folha */
        box-sizing: border-box; /* Garante que padding e borda estejam inclusos na largura/altura */
        display: flex; /* Adiciona flexbox */
        flex-direction: column; /* Organiza os itens em coluna */
        /* Remova justify-content e align-items para não adicionar espaço extra no topo do PDF */
        /* justify-content: flex-start; */
        /* align-items: flex-start; */
        text-align: initial; /* Reseta o text-align que pode ser herdado */
    }
    .c23 { font-size: 11pt; font-weight: 700; font-family: "Arial" }
    .c38 { color: #000000; vertical-align: baseline; font-style: normal }
    .c30 { border-top-width: 0.5pt; border-top-color: #000000; border-top-style: solid }
    .c50 { margin-left: 216pt; text-indent: 36pt }
    .c33 { font-weight: 700; font-family: "Arial" }
    .c43 { height: 56.2pt }
    .c5 { height: 12pt }
    .c21 { height: 20.8pt }
    .c39 { height: 21pt }
    .c45 { height: 7.8pt }
    .c1 { height: 87.8pt }
    .c7 { height: 0pt }
    .c37 { height: 20.6pt }
    .c32 { background-color: #d9d9d9 }
    .c31 { height: 91.6pt }
    .c18 { height: 13.7pt }
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

    /* Estilos para o corpo da página para centralizar o "documento A4" */
    body {
        display: flex;
        flex-direction: column; /* Organiza o botão acima ou abaixo do A4 */
        justify-content: flex-start; /* Alinha o conteúdo ao topo */
        align-items: center; /* Centraliza horizontalmente os itens */
        min-height: 100vh;
        background-color: #f0f0f0;
        margin: 0;
        padding-top: 20px; /* Adiciona um padding no topo do body para o botão */
        overflow-y: auto;
    }

    /* Estilos para o botão */
    .download-button {
      margin-bottom: 20px; /* Espaço entre o botão e o A4 */
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

    /* Ocultar o botão ao imprimir/gerar PDF */
    @media print {
      .download-button {
        display: none;
      }
    }
  `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
            {/* Botão de Download movido para cima */}
            <button className="download-button" onClick={handleDownloadPdf}>
                Download PDF
            </button>

            {/* Adicione a referência ao div que contém o conteúdo do A4 */}
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
                        <span className="c27">AV Doutor Randolfo Borges Junior 2900 – Univerdecidade- Uberaba (MG) - CEP: 38.064-200</span>
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