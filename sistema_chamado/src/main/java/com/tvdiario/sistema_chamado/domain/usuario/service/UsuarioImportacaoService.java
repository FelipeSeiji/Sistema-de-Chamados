package com.tvdiario.sistema_chamado.domain.usuario.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.common.exception.RegraNegocioException;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;
import com.tvdiario.sistema_chamado.domain.usuario.validator.UsuarioValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioImportacaoService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioValidator usuarioValidator;
    private final PasswordEncoder passwordEncoder;

    private static final String SENHA_PADRAO_IMPORTACAO = "tvdiario@2025";

    @Transactional
    public List<Usuario> importarUsuarios(List<Usuario> novosUsuarios) {
        if (novosUsuarios == null || novosUsuarios.isEmpty()) {
            throw new RegraNegocioException("A lista de usuários para importação não pode estar vazia.");
        }

        return novosUsuarios.stream()
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank())
                .map(u -> {
                    u.setEmail(u.getEmail().trim().toLowerCase());
                    return u;
                })
                .filter(u -> !usuarioRepository.existsByEmailIgnoreCase(u.getEmail()))
                .peek(u -> {
                    usuarioValidator.validarNovoUsuario(u);

                    if (u.getPassword() == null || u.getPassword().isBlank()) {
                        u.setPassword(passwordEncoder.encode(SENHA_PADRAO_IMPORTACAO));
                    } else {
                        u.setPassword(passwordEncoder.encode(u.getPassword()));
                    }

                    if (u.getUsername() == null || u.getUsername().isBlank()) {
                        u.setUsername(u.getEmail().split("@")[0]);
                    }
                })
                .map(usuarioRepository::save)
                .toList();
    }
}