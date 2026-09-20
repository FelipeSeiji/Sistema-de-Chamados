package com.tvdiario.sistema_chamado.domain.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.common.exception.EntidadeNaoEncontradaException;
import com.tvdiario.sistema_chamado.common.exception.RegraNegocioException;
import com.tvdiario.sistema_chamado.domain.dto.LoginDTO;
import com.tvdiario.sistema_chamado.domain.dto.TrocarSenhaDTO;
import com.tvdiario.sistema_chamado.domain.model.Usuario;
import com.tvdiario.sistema_chamado.domain.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.model.enums.UsuarioTipo;
import com.tvdiario.sistema_chamado.domain.repository.ChamadoRepository;
import com.tvdiario.sistema_chamado.domain.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ChamadoRepository chamadoRepository;

    @Transactional
    public Usuario criarUsuario(Usuario usuario) {
        validarEmailUnico(usuario.getEmail());
        
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        definirTipoUsuarioPadrao(usuario);

        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario autenticar(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(dto.email().trim())
                .orElseThrow(() -> new RegraNegocioException("E-mail ou senha incorretos."));
        if (!usuario.getPassword().equals(dto.senha())) {
            throw new RegraNegocioException("E-mail ou senha incorretos.");
        }

        return usuario;
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(UUID id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário não encontrado para o ID: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return Optional.ofNullable(email)
                .filter(e -> !e.isBlank())
                .flatMap(e -> usuarioRepository.findByEmailIgnoreCase(e.trim()));
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAllByOrderByNomeAsc();
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTecnicos() {
        return usuarioRepository.findByUsuarioTipo(UsuarioTipo.TECH);
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarPorDepartamento(Departamento departamento) {
        return usuarioRepository.findByDepartamento(departamento);
    }

    @Transactional
    public Usuario atualizarUsuario(UUID id, Usuario dadosAtualizados) {
        Usuario usuarioExistente = buscarPorId(id);

        Optional.ofNullable(dadosAtualizados.getNome())
                .filter(nome -> !nome.isBlank())
                .map(String::trim)
                .ifPresent(usuarioExistente::setNome);

        Optional.ofNullable(dadosAtualizados.getUsername())
                .filter(username -> !username.isBlank())
                .map(String::trim)
                .ifPresent(usuarioExistente::setUsername);

        Optional.ofNullable(dadosAtualizados.getDepartamento())
                .ifPresent(dept -> {
                    usuarioExistente.setDepartamento(dept);
                    definirTipoUsuarioPadrao(usuarioExistente);
                });

        Optional.ofNullable(dadosAtualizados.getUsuarioTipo())
                .ifPresent(usuarioExistente::setUsuarioTipo);

        return usuarioRepository.save(usuarioExistente);
    }

    @Transactional
    public void trocarSenha(UUID id, TrocarSenhaDTO dto) {
        Usuario usuario = buscarPorId(id);

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

        Usuario usuario = buscarPorId(id);
        usuario.setPassword(novaSenha.trim());
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void excluirUsuario(UUID id) {
        Usuario usuario = buscarPorId(id);

        long totalChamados = chamadoRepository.countByUsuarioId(id);
        if (totalChamados > 0) {
            throw new RegraNegocioException(
                String.format("Não é possível excluir: %s possui %d chamado(s) associado(s).",
                    usuario.getNome(), totalChamados)
            );
        }

        usuarioRepository.delete(usuario);
    }

    @Transactional
    public List<Usuario> importarUsuarios(List<Usuario> novosUsuarios) {
        return novosUsuarios.stream()
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank())
                .map(u -> {
                    u.setEmail(u.getEmail().trim().toLowerCase());
                    return u;
                })
                .filter(u -> !usuarioRepository.existsByEmailIgnoreCase(u.getEmail()))
                .peek(u -> {
                    definirTipoUsuarioPadrao(u);
                    if (u.getPassword() == null || u.getPassword().isBlank()) {
                        u.setPassword("tvdiario@2025");
                    }
                    if (u.getUsername() == null || u.getUsername().isBlank()) {
                        u.setUsername(u.getEmail().split("@")[0]);
                    }
                })
                .map(usuarioRepository::save)
                .toList();
    }

    private void validarEmailUnico(String email) {
        if (usuarioRepository.existsByEmailIgnoreCase(email.trim())) {
            throw new RegraNegocioException("Este e-mail já está cadastrado.");
        }
    }

    private void definirTipoUsuarioPadrao(Usuario usuario) {
        if (usuario.getDepartamento() == Departamento.TECNOLOGIA && usuario.getUsuarioTipo() == null) {
            usuario.setUsuarioTipo(UsuarioTipo.TECH);
        } else if (usuario.getUsuarioTipo() == null) {
            usuario.setUsuarioTipo(UsuarioTipo.USER);
        }
    }
}