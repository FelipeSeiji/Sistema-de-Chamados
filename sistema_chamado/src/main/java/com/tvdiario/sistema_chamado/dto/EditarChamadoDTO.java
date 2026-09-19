package com.tvdiario.sistema_chamado.dto;

import com.tvdiario.sistema_chamado.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.model.enums.Prioridade;

public record EditarChamadoDTO(
    String titulo,
    String descricao,
    CategoriaChamado categoria,
    Prioridade prioridade
) {
}
