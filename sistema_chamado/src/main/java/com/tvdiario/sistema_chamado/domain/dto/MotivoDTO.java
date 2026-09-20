package com.tvdiario.sistema_chamado.domain.dto;

import jakarta.validation.constraints.NotBlank;

public record MotivoDTO(
    @NotBlank(message = "O motivo é obrigatório.")
    String motivo
) {}