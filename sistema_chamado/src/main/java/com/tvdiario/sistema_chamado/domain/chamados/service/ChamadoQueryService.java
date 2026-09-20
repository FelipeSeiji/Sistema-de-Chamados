package com.tvdiario.sistema_chamado.domain.chamados.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.common.exception.EntidadeNaoEncontradaException;
import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.domain.chamados.repository.ChamadoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChamadoQueryService {
    private final ChamadoRepository chamadoRepository;

    public Chamado buscarPorId(Long id) {
        return chamadoRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Chamado não encontrado para o ID: " + id));
    }

    public List<Chamado> listarTodos() {
        return chamadoRepository.findAllByOrderByCriadoEmDesc();
    }

    public List<Chamado> listarPorUsuario(UUID usuarioId) {
        return chamadoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId);
    }

    public List<Chamado> listarPorStatus(StatusChamado status) {
        return chamadoRepository.findByStatusOrderByCriadoEmDesc(status);
    }

    public List<Chamado> listarPorCategoria(CategoriaChamado categoria) {
        return chamadoRepository.findByCategoria(categoria);
    }
}