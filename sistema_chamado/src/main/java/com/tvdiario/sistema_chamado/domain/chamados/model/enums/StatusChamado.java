package com.tvdiario.sistema_chamado.domain.chamados.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusChamado {
    ABERTO,
    EM_ATENDIMENTO,
    AGUARDANDO,
    CONCLUIDO,
    CANCELADO
}