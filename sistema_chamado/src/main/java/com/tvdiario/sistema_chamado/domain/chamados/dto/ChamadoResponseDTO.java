package com.tvdiario.sistema_chamado.domain.chamados.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.tvdiario.sistema_chamado.domain.chamados.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.Prioridade;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.StatusChamado;

public record ChamadoResponseDTO(
    Long id,
    String titulo,
    String descricao,
    String solucao,
    CategoriaChamado categoria,
    StatusChamado status,
    Prioridade prioridade,
    UUID usuarioId,
    String usuarioNome,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {}