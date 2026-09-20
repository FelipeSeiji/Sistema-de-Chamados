package com.tvdiario.sistema_chamado.domain.dto;

import com.tvdiario.sistema_chamado.domain.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.domain.model.enums.Prioridade;

import jakarta.validation.constraints.Size;

public record EditarChamadoDTO(
    @Size(max = 200, message = "O título deve ter no máximo 200 caracteres.")
    String titulo,

    String descricao,
    CategoriaChamado categoria,
    Prioridade prioridade
) {}