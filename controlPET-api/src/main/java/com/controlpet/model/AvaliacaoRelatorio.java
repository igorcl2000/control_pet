package com.controlpet.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

import com.controlpet.model.enums.CriterioAvaliacao; // Precisaremos criar este enum

@Entity
@Table(name = "avaliacoes_relatorio")
@Getter @Setter
public class AvaliacaoRelatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "relatorio_id", unique = true, nullable = false)
    private Relatorio relatorio;

    @Enumerated(EnumType.STRING)
    @Column(name = "carga_horaria", nullable = false)
    private CriterioAvaliacao cargaHoraria;

    @Enumerated(EnumType.STRING)
    @Column(name = "interesse_atividades", nullable = false)
    private CriterioAvaliacao interesseAtividades;

    @Enumerated(EnumType.STRING)
    @Column(name = "habilidades_desenvolvidas", nullable = false)
    private CriterioAvaliacao habilidadesDesenvolvidas;

    @Column(name = "outras_informacoes", columnDefinition = "TEXT")
    private String outrasInformacoes;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Relatorio getRelatorio() {
        return relatorio;
    }

    public void setRelatorio(Relatorio relatorio) {
        this.relatorio = relatorio;
    }

    public CriterioAvaliacao getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(CriterioAvaliacao cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public CriterioAvaliacao getInteresseAtividades() {
        return interesseAtividades;
    }

    public void setInteresseAtividades(CriterioAvaliacao interesseAtividades) {
        this.interesseAtividades = interesseAtividades;
    }

    public CriterioAvaliacao getHabilidadesDesenvolvidas() {
        return habilidadesDesenvolvidas;
    }

    public void setHabilidadesDesenvolvidas(CriterioAvaliacao habilidadesDesenvolvidas) {
        this.habilidadesDesenvolvidas = habilidadesDesenvolvidas;
    }

    public String getOutrasInformacoes() {
        return outrasInformacoes;
    }

    public void setOutrasInformacoes(String outrasInformacoes) {
        this.outrasInformacoes = outrasInformacoes;
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
}