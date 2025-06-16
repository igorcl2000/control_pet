package com.controlpet.dto;

import com.controlpet.model.enums.TipoUsuario;

public record UserInfoDTO(
	Integer id,
    String nome,
    String email,
    TipoUsuario tipoUsuario
) {}