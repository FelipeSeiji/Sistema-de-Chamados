package com.tvdiario.sistema_chamado.domain.chamados.dto;

import com.tvdiario.sistema_chamado.domain.chamados.model.enums.StatusChamado;

import jakarta.validation.constraints.NotNull;

public record AtualizarChamadoDTO(
    String solucao,

    @NotNull(message = "O status é obrigatório.")
    StatusChamado status
) {}