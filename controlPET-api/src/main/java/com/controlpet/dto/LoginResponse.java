// LoginResponse.java
package com.controlpet.dto;

import com.controlpet.model.enums.TipoUsuario;

public record LoginResponse (
        String nome,
        TipoUsuario tipoUsuario,
        String token

) { }