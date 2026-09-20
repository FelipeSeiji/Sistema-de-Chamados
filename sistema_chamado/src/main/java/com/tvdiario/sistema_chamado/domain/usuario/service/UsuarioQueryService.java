package com.tvdiario.sistema_chamado.domain.usuario.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.common.exception.EntidadeNaoEncontradaException;
import com.tvdiario.sistema_chamado.domain.usuario.dto.UsuarioResponseDTO;
import com.tvdiario.sistema_chamado.domain.usuario.mapper.UsuarioMapper;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.UsuarioTipo;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;
import com.tvdiario.sistema_chamado.domain.usuario.specification.UsuarioSpecifications;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioQueryService {
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper mapper;

    @Transactional(readOnly = true)
    public Usuario buscarPorId(UUID id) {
        UUID idValido = Objects.requireNonNull(id, "O ID do usuário não pode ser nulo.");

        return usuarioRepository.findById(idValido)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário não encontrado para o ID: " + idValido));
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
        return usuarioRepository.findByUsuarioTipo(UsuarioTipo.TECNICO);
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarPorDepartamento(Departamento departamento) {
        return usuarioRepository.findByDepartamento(departamento);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> buscarUsuarios(Departamento depto, String termo) {
        Specification<Usuario> spec = Specification.allOf(
                UsuarioSpecifications.porDepartamento(depto),
                UsuarioSpecifications.porNomeOuEmail(termo)
        );

        List<Usuario> usuarios = usuarioRepository.findAll(spec);
        return mapper.toDTOList(usuarios);
    }
}
