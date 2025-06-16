package com.controlpet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "relatorios")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter @Setter
public class Relatorio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;
    
    @Column(name = "tipo_relatorio", length = 50)
    private String tipoRelatorio = "Relatório Mensal";
    
    @NotNull
    @Column(name = "data_inicial", nullable = false)
    private LocalDate dataInicial;
    
    @NotNull
    @Column(name = "data_final", nullable = false)
    private LocalDate dataFinal;
    
    @Column(name = "data_envio")
    private LocalDate dataEnvio;
    
    @Column(name = "resumo_atividades", columnDefinition = "TEXT")
    private String resumoAtividades;
    
    @Column(columnDefinition = "TEXT")
    private String comentarios;
    
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
    
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm = LocalDateTime.now();
    
    

    public Integer getId() {
		return id;
	}



	public void setId(Integer id) {
		this.id = id;
	}



	public Aluno getAluno() {
		return aluno;
	}



	public void setAluno(Aluno aluno) {
		this.aluno = aluno;
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



	public LocalDate getDataEnvio() {
		return dataEnvio;
	}



	public void setDataEnvio(LocalDate dataEnvio) {
		this.dataEnvio = dataEnvio;
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



	public LocalDateTime getCriadoEm() {
		return criadoEm;
	}



	public void setCriadoEm(LocalDateTime criadoEm) {
		this.criadoEm = criadoEm;
	}



	public LocalDateTime getAtualizadoEm() {
		return atualizadoEm;
	}



	public void setAtualizadoEm(LocalDateTime atualizadoEm) {
		this.atualizadoEm = atualizadoEm;
	}



	@PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}