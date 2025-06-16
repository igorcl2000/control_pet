package com.controlpet.dto;

import com.controlpet.model.enums.TipoUsuario;
import jakarta.validation.constraints.*;

public record UsuarioDTO(
	    @NotBlank String nome,
	    @Email @NotBlank String email,
	    @Size(min = 6) String senha,
	    String tipo  // Opcional
	) {
	    public TipoUsuario getTipoAsEnum() {
	        return TipoUsuario.aluno; // Sempre retorna aluno como padrão
	    }
	}