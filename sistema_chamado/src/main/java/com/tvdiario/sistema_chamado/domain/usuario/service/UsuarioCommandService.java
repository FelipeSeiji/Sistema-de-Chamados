package com.tvdiario.sistema_chamado.domain.usuario.service;

import java.util.Objects;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.common.exception.RegraNegocioException;
import com.tvdiario.sistema_chamado.domain.chamados.repository.ChamadoRepository;
import com.tvdiario.sistema_chamado.domain.usuario.dto.AtualizarUsuarioDTO;
import com.tvdiario.sistema_chamado.domain.usuario.mapper.UsuarioMapper;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;
import com.tvdiario.sistema_chamado.domain.usuario.validator.UsuarioValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioCommandService {
private final UsuarioRepository usuarioRepository;
    private final UsuarioQueryService usuarioQueryService;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioValidator usuarioValidator;
    private final ChamadoRepository chamadoRepository;

    @Transactional
    public Usuario criarUsuario(Usuario usuario) {
        usuarioValidator.validarNovoUsuario(usuario);
        
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        
        if (usuario.getPassword() != null) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario atualizarUsuario(UUID id, AtualizarUsuarioDTO dto) {
        Usuario usuario = usuarioQueryService.buscarPorId(id);
        usuarioMapper.updateUsuarioFromDto(dto, usuario);

        return usuarioRepository.save(Objects.requireNonNull(usuario));
    }

    @Transactional
    public void excluirUsuario(UUID id) {
        Usuario usuario = usuarioQueryService.buscarPorId(id);

        long totalChamados = chamadoRepository.countByUsuarioId(id);
        if (totalChamados > 0) {
            throw new RegraNegocioException(
                String.format("Não é possível excluir: %s possui %d chamado(s) associado(s).",
                    usuario.getNome(), totalChamados)
            );
        }
        usuarioRepository.delete(Objects.requireNonNull(usuario));
    }
}
