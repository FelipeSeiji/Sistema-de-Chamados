package com.tvdiario.sistema_chamado.domain.usuario.dto;

import com.tvdiario.sistema_chamado.domain.usuario.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.UsuarioTipo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CriarUsuarioDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,

    @NotBlank(message = "O username é obrigatório")
    String username,

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail inválido")
    @Size(max = 100, message = "O e-mail deve ter no máximo 100 caracteres.")
    String email,

    @NotBlank(message = "A senha é obrigatória")
    String password,

    @NotNull(message = "O departamento é obrigatório")
    Departamento departamento,

    @NotNull(message = "O tipo de usuário é obrigatório") // Garante que o tipo seja enviado na criação
    UsuarioTipo usuarioTipo
) {}