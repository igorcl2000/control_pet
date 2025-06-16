package com.controlpet.dto;

import com.controlpet.model.enums.TipoEstudante;
import jakarta.validation.constraints.*;

public record AlunoDTO(
    @NotNull(message = "ID do usuário é obrigatório") Integer usuarioId,
    @NotNull(message = "Idade é obrigatória") @Min(16) Integer idade,
    @NotBlank(message = "Período/ano é obrigatório") String periodoAno,
    @NotBlank(message = "Edital de ingresso é obrigatório") String editalIngresso,
    @NotNull(message = "Tipo de estudante é obrigatório") TipoEstudante tipoEstudante,
    @NotBlank(message = "Curso é obrigatório") String curso
) {}