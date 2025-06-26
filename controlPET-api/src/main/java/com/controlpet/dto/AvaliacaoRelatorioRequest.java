package com.controlpet.dto;

import com.controlpet.model.enums.CriterioAvaliacao;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AvaliacaoRelatorioRequest {

    @NotNull(message = "O ID do relatório é obrigatório.")
    private Integer relatorioId;

    @NotNull(message = "A carga horária é obrigatória.")
    private CriterioAvaliacao cargaHoraria;

    @NotNull(message = "O interesse nas atividades é obrigatório.")
    private CriterioAvaliacao interesseAtividades;

    @NotNull(message = "As habilidades desenvolvidas são obrigatórias.")
    private CriterioAvaliacao habilidadesDesenvolvidas;

    private String outrasInformacoes;
}