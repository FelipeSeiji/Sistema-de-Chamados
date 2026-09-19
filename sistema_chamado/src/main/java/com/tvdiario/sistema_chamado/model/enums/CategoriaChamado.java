package com.tvdiario.sistema_chamado.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CategoriaChamado {
    TI_EQUIPAMENTOS,
    TI_SOFTWARE,
    TI_REDE,
    TI_ACESSO,
    ENG_AUDIO,
    ENG_VIDEO,
    ENG_REDE,
    ENG_ACESSO
}