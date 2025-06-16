package com.controlpet.dto;

import java.time.LocalDate;

import com.controlpet.model.Relatorio;

// src/main/java/com/controlpet/dto/RelatorioResponseDTO.java
public class RelatorioResponseDTO {
    private Integer id;
    private String tipoRelatorio;
    private LocalDate dataInicial;
    private LocalDate dataFinal;
    private String resumoAtividades;
    private String comentarios;
    private Integer alunoId;
    private String alunoNome;

    // Construtor que recebe a entidade Relatorio
    public RelatorioResponseDTO(Relatorio relatorio) {
        this.id = relatorio.getId();
        this.tipoRelatorio = relatorio.getTipoRelatorio();
        this.dataInicial = relatorio.getDataInicial();
        this.dataFinal = relatorio.getDataFinal();
        this.resumoAtividades = relatorio.getResumoAtividades();
        this.comentarios = relatorio.getComentarios();
        this.alunoId = relatorio.getAluno() != null ? relatorio.getAluno().getId() : null;
        this.alunoNome = relatorio.getAluno() != null && relatorio.getAluno().getUsuario() != null 
            ? relatorio.getAluno().getUsuario().getNome() 
            : null;
    }

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTipoRelatorio() {
		return tipoRelatorio;
	}

	public void setTipoRelatorio(String tipoRelatorio) {
		this.tipoRelatorio = tipoRelatorio;
	}

	public LocalDate getDataInicial() {
		return dataInicial;
	}

	public void setDataInicial(LocalDate dataInicial) {
		this.dataInicial = dataInicial;
	}

	public LocalDate getDataFinal() {
		return dataFinal;
	}

	public void setDataFinal(LocalDate dataFinal) {
		this.dataFinal = dataFinal;
	}

	public String getResumoAtividades() {
		return resumoAtividades;
	}

	public void setResumoAtividades(String resumoAtividades) {
		this.resumoAtividades = resumoAtividades;
	}

	public String getComentarios() {
		return comentarios;
	}

	public void setComentarios(String comentarios) {
		this.comentarios = comentarios;
	}

	public Integer getAlunoId() {
		return alunoId;
	}

	public void setAlunoId(Integer alunoId) {
		this.alunoId = alunoId;
	}

	public String getAlunoNome() {
		return alunoNome;
	}

	public void setAlunoNome(String alunoNome) {
		this.alunoNome = alunoNome;
	}

    
}