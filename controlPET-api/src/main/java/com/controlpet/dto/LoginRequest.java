// LoginRequest.java
package com.controlpet.dto;

public record LoginRequest(
    String email,
    String senha
) {}