package com.tvdiario.sistema_chamado.infrastructure.security;

import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.UsuarioTipo;
import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CurrentUser {
    private final UsuarioRepository usuarios;

    public Usuario get() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("Autenticação necessária.");
        }
        return usuarios.findById(UUID.fromString(auth.getName()))
            .orElseThrow(() -> new AccessDeniedException("Sessão inválida."));
    }

    public boolean isTech() {
        return get().getUsuarioTipo() != UsuarioTipo.USUARIO;
    }

    public void requireTech() {
        if (!isTech()) throw new AccessDeniedException("Acesso restrito à equipe técnica.");
    }

    public void requireAdmin() {
        if (get().getUsuarioTipo() != UsuarioTipo.ADMINISTRADOR)
            throw new AccessDeniedException("Acesso restrito ao administrador.");
    }

    public void requireSelfOrAdmin(UUID id) {
        if (!get().getId().equals(id)) requireAdmin();
    }

    public void requireOwnerOrTech(Chamado chamado) {
        if (!get().getId().equals(chamado.getUsuario().getId())) requireTech();
    }
}
