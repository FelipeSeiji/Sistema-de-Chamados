package com.tvdiario.sistema_chamado.domain.usuario.specification;

import org.springframework.data.jpa.domain.Specification;

import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.Departamento;

public class UsuarioSpecifications {
    private UsuarioSpecifications() {}

    public static Specification<Usuario> porDepartamento(Departamento depto) {
        return (root, query, builder) -> 
            depto == null ? null : builder.equal(root.get("departamento"), depto);
    }

    public static Specification<Usuario> porNomeOuEmail(String termo) {
        return (root, query, builder) -> {
            if (termo == null || termo.isBlank()) return null;
            String pattern = "%" + termo.trim().toLowerCase() + "%";
            return builder.or(
                builder.like(builder.lower(root.get("nome")), pattern),
                builder.like(builder.lower(root.get("email")), pattern)
            );
        };
    }
}