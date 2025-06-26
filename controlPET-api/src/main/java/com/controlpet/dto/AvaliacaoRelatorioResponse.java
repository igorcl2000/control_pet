package com.controlpet.dto;

import com.controlpet.model.enums.CriterioAvaliacao;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class AvaliacaoRelatorioResponse {
    private Integer id;
    private Integer relatorioId; // Apenas o ID do relatório
    private String tipoRelatorio; // Para exibir informações do relatório
    private CriterioAvaliacao cargaHoraria;
    private CriterioAvaliacao interesseAtividades;
    private CriterioAvaliacao habilidadesDesenvolvidas;
    private String outrasInformacoes;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}