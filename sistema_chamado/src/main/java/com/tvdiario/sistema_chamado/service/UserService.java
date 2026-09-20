package com.tvdiario.sistema_chamado.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.model.Usuario;
import com.tvdiario.sistema_chamado.model.enums.Departamento;
import com.tvdiario.sistema_chamado.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.model.enums.UsuarioTipo;
import com.tvdiario.sistema_chamado.repository.ChamadoRepository;
import com.tvdiario.sistema_chamado.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ChamadoRepository chamadoRepository;

    @Transactional
    public Usuario criarUsuario(Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("O e-mail é obrigatório.");
        }

        String emailTratado = usuario.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(emailTratado)) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado.");
        }
        usuario.setEmail(emailTratado);

        LocalDateTime agora = LocalDateTime.now();
        if (usuario.getCriadoEm() == null) {
            usuario.setCriadoEm(agora);
        }
        usuario.setAtualizadoEm(agora);

        if (usuario.getDepartamento() == Departamento.TECNOLOGIA && usuario.getUsuarioTipo() == null) {
            usuario.setUsuarioTipo(UsuarioTipo.TECH);
        } else if (usuario.getUsuarioTipo() == null) {
            usuario.setUsuarioTipo(UsuarioTipo.USER);
        }
        return userRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario autenticar(String email, String senha) {
        if (email == null || senha == null) {
            throw new IllegalArgumentException("E-mail e senha são obrigatórios.");
        }

        Usuario usuario = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha incorretos."));

        if (!usuario.getPassword().equals(senha)) {
            throw new IllegalArgumentException("E-mail ou senha incorretos.");
        }

        return usuario;
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado para o ID:  " + id));
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        if (email == null) return Optional.empty();
        return userRepository.findByEmailIgnoreCase(email.trim());
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return userRepository.findAllByOrderByNomeAsc();
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTecnicos() {
        return userRepository.findByUsuarioTipo(UsuarioTipo.TECH);
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarPorDepartamento(Departamento departamento) {
        return userRepository.findByDepartamento(departamento);
    }

    @Transactional
    public Usuario atualizarUsuario(UUID id, Usuario dadosAtualizados) {
        Usuario usuarioExistente = buscarPorId(id);

        if (dadosAtualizados.getNome() != null && !dadosAtualizados.getNome().isBlank()) {
            usuarioExistente.setNome(dadosAtualizados.getNome().trim());
        }

        if (dadosAtualizados.getUsername() != null && !dadosAtualizados.getUsername().isBlank()) {
            usuarioExistente.setUsername(dadosAtualizados.getUsername().trim());
        }

        if (dadosAtualizados.getDepartamento() != null) {
            usuarioExistente.setDepartamento(dadosAtualizados.getDepartamento());
            if (dadosAtualizados.getDepartamento() == Departamento.TECNOLOGIA
                    && usuarioExistente.getUsuarioTipo() == UsuarioTipo.USER) {
                usuarioExistente.setUsuarioTipo(UsuarioTipo.TECH);
            }
        }

        if (dadosAtualizados.getUsuarioTipo() != null) {
            usuarioExistente.setUsuarioTipo(dadosAtualizados.getUsuarioTipo());
        }

        usuarioExistente.setAtualizadoEm(LocalDateTime.now());
        return userRepository.save(usuarioExistente);
    }

    @Transactional
    public void trocarSenha(UUID id, String senhaAtual, String novaSenha) {
        Usuario usuario = buscarPorId(id);

        if (!usuario.getPassword().equals(senhaAtual)) {
            throw new IllegalArgumentException("A senha atual informada está incorreta.");
        }

        if (novaSenha == null || novaSenha.trim().length() < 6) {
            throw new IllegalArgumentException("A nova senha deve conter no mínimo 6 caracteres.");
        }

        usuario.setPassword(novaSenha.trim());
        usuario.setAtualizadoEm(LocalDateTime.now());
        userRepository.save(usuario);
    }

    @Transactional
    public void redefinirSenha(UUID id, String novaSenha) {
        if (novaSenha == null || novaSenha.trim().length() < 6) {
            throw new IllegalArgumentException("A nova senha deve conter no mínimo 6 caracteres.");
        }

        Usuario usuario = buscarPorId(id);
        usuario.setPassword(novaSenha.trim());
        usuario.setAtualizadoEm(LocalDateTime.now());
        userRepository.save(usuario);
    }

    @Transactional
    public Usuario alterarStatus(UUID id, StatusChamado novoStatus) {
        Usuario usuario = buscarPorId(id);
        usuario.setAtualizadoEm(LocalDateTime.now());
        return userRepository.save(usuario);
    }

    @Transactional
    public void excluirUsuario(UUID id) {
        Usuario usuario = buscarPorId(id);

        long totalChamados = chamadoRepository.countByUsuario_Id(id);
        if (totalChamados > 0) {
            throw new IllegalStateException(
                String.format("Não é possível excluir: %s possui %d chamado(s) associado(s). Altere o status em vez de excluir.",
                    usuario.getNome(), totalChamados)
            );
        }

        userRepository.delete(usuario);
    }

    @Transactional
    public List<Usuario> importarUsuarios(List<Usuario> novosUsuarios) {
        List<Usuario> salvos = new ArrayList<>();
        LocalDateTime agora = LocalDateTime.now();

        for (Usuario u : novosUsuarios) {
            if (u.getEmail() == null || u.getEmail().isBlank()) {
                continue;
            }
            String email = u.getEmail().trim().toLowerCase();
            if (userRepository.existsByEmailIgnoreCase(email)) {
                continue; 
            }

            u.setEmail(email);
            u.setCriadoEm(agora);
            u.setAtualizadoEm(agora);

            if (u.getDepartamento() == Departamento.TECNOLOGIA && u.getUsuarioTipo() == null) {
                u.setUsuarioTipo(UsuarioTipo.TECH);
            } else if (u.getUsuarioTipo() == null) {
                u.setUsuarioTipo(UsuarioTipo.USER);
            }

            if (u.getPassword() == null || u.getPassword().isBlank()) {
                u.setPassword("tvdiario@2025");
            }

            if (u.getUsername() == null || u.getUsername().isBlank()) {
                u.setUsername(email.split("@")[0]);
            }

            salvos.add(userRepository.save(u));
        }

        return salvos;
    }
}