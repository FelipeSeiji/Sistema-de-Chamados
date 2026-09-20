package com.tvdiario.sistema_chamado.domain.usuario.service.auth;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.common.exception.RegraNegocioException;
import com.tvdiario.sistema_chamado.domain.usuario.dto.LoginDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.TrocarSenhaDTO;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;
import com.tvdiario.sistema_chamado.domain.usuario.service.UsuarioQueryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final UsuarioQueryService usuarioQueryService;

    @Transactional(readOnly = true)
    public Usuario autenticar(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(dto.email().trim())
                .orElseThrow(() -> new RegraNegocioException("E-mail ou senha incorretos."));

        if (!usuario.getPassword().equals(dto.senha())) {
            throw new RegraNegocioException("E-mail ou senha incorretos.");
        }

        return usuario;
    }

    @Transactional
    public void trocarSenha(UUID id, TrocarSenhaDTO dto) {
        Usuario usuario = usuarioQueryService.buscarPorId(id);

        if (!usuario.getPassword().equals(dto.senhaAtual())) {
            throw new RegraNegocioException("A senha atual informada está incorreta.");
        }

        usuario.setPassword(dto.novaSenha().trim());
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void redefinirSenha(UUID id, String novaSenha) {
        if (novaSenha == null || novaSenha.trim().length() < 6) {
            throw new RegraNegocioException("A nova senha deve conter no mínimo 6 caracteres.");
        }

        Usuario usuario = usuarioQueryService.buscarPorId(id);
        usuario.setPassword(novaSenha.trim());
        usuarioRepository.save(usuario);
    }
}