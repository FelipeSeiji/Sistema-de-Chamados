package com.tvdiario.sistema_chamado.domain.usuario.validator;

import org.springframework.stereotype.Component;

import com.tvdiario.sistema_chamado.common.exception.RegraNegocioException;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsuarioValidator {

    private final UsuarioRepository usuarioRepository;

    public void validarNovoUsuario(Usuario usuario) {
        validarEmailObrigatorioEUnico(usuario.getEmail());
        
        if (usuario.getUsuarioTipo() == null) {
            throw new RegraNegocioException("O tipo do usuário deve ser informado explicitamente.");
        }
    }

    public void validarEmailObrigatorioEUnico(String email) {
        if (email == null || email.isBlank()) {
            throw new RegraNegocioException("O e-mail é obrigatório.");
        }
        if (usuarioRepository.existsByEmailIgnoreCase(email.trim())) {
            throw new RegraNegocioException("Este e-mail já está cadastrado.");
        }
    }

    public void validarEmailUnico(String email) {
        if (usuarioRepository.existsByEmailIgnoreCase(email.trim())) {
            throw new RegraNegocioException("Este e-mail já está em uso por outro usuário.");
        }
    }
}