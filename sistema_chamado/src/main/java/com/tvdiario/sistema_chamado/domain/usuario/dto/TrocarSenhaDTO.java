package com.tvdiario.sistema_chamado.domain.usuario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrocarSenhaDTO(
    @NotBlank(message = "A senha atual é obrigatória.")
    String senhaAtual,

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 6, max = 72, message = "A nova senha deve conter entre 6 e 72 caracteres.")
    String novaSenha
) {}
