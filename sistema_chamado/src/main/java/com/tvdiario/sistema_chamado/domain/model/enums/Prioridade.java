package com.tvdiario.sistema_chamado.domain.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Prioridade {
    BAIXA,
    MEDIA,
    ALTA,
    URGENTE
}