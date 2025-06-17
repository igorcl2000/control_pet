package com.controlpet.dto;


public record ChangePasswordRequest(
        String currentPassword,
        String newPassword
) {}