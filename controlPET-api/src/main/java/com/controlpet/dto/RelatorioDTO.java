package com.controlpet.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record RelatorioDTO(
    @NotNull(message = "ID do aluno é obrigatório") Integer alunoId,
    
    @Size(max = 50, message = "Tipo de relatório deve ter no máximo 50 caracteres")
    String tipoRelatorio,
    
    @NotNull(message = "Data inicial é obrigatória") LocalDate dataInicial,
    @NotNull(message = "Data final é obrigatória") LocalDate dataFinal,
    
    LocalDate dataEnvio,
    
    @Size(max = 2000, message = "Resumo deve ter no máximo 2000 caracteres")
    String resumoAtividades,
    
    @Size(max = 1000, message = "Comentários devem ter no máximo 1000 caracteres")
    String comentarios
) {}