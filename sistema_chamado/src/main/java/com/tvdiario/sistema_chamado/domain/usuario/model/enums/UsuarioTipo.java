package com.tvdiario.sistema_chamado.domain.usuario.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UsuarioTipo {
    ADMINISTRADOR,
    TECNICO,
    USUARIO
}