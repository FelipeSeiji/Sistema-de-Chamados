package com.tvdiario.sistema_chamado.domain.usuario.dto;

import com.tvdiario.sistema_chamado.domain.usuario.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.UsuarioTipo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AtualizarUsuarioDTO(
    @NotBlank(message = "O nome é obrigatório.")
    String nome,
    
    @NotBlank(message = "O username é obrigatório.")
    String username,
    
    @NotNull(message = "O departamento é obrigatório.")
    Departamento departamento,
    
    @NotNull(message = "O tipo de usuário é obrigatório.")
    UsuarioTipo usuarioTipo
) {}