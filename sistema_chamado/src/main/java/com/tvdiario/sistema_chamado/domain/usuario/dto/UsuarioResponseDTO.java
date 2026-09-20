package com.tvdiario.sistema_chamado.domain.usuario.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.tvdiario.sistema_chamado.domain.usuario.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.UsuarioTipo;

public record UsuarioResponseDTO(
    UUID id,
    String nome,
    String username,
    String email,
    Departamento departamento,
    UsuarioTipo usuarioTipo,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {}