package com.tvdiario.sistema_chamado.dto;

import com.tvdiario.sistema_chamado.model.enums.StatusChamado;

public record AtualizarChamadoDTO(
    String solucao,
    StatusChamado status
) {
}
