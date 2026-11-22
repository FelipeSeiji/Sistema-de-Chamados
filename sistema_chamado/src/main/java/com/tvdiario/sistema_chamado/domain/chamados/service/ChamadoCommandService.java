package com.tvdiario.sistema_chamado.domain.chamados.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.common.exception.EntidadeNaoEncontradaException;
import com.tvdiario.sistema_chamado.domain.chamados.dto.AtualizarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.chamados.dto.CriarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.chamados.dto.EditarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;
import com.tvdiario.sistema_chamado.domain.chamados.repository.ChamadoRepository;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChamadoCommandService {
    private final ChamadoRepository chamadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ChamadoQueryService chamadoQueryService;
    private final com.tvdiario.sistema_chamado.infrastructure.security.CurrentUser currentUser;

    @Transactional
    public Chamado abrirChamado(CriarChamadoDTO dto, UUID usuarioId) {
        if (!currentUser.get().getId().equals(usuarioId)) currentUser.requireTech();
        Usuario solicitante = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário solicitante não encontrado."));

        Chamado chamado = Chamado.builder()
                .titulo(dto.titulo())
                .descricao(dto.descricao())
                .categoria(dto.categoria())
                .prioridade(dto.prioridade())
                .build();

        chamado.inicializarChamadoPadrao(solicitante);
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado assumirChamado(Long chamadoId) {
        currentUser.requireTech();
        Chamado chamado = chamadoQueryService.buscarPorId(chamadoId);
        chamado.assumir();
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado atualizarChamado(Long chamadoId, AtualizarChamadoDTO dto) {
        currentUser.requireTech();
        Chamado chamado = chamadoQueryService.buscarPorId(chamadoId);
        if (dto.solucao() != null && !dto.solucao().isBlank()) {
            chamado.setSolucao(dto.solucao().trim());
        }
        if (dto.status() != null) {
            chamado.setStatus(dto.status());
        }
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado concluirChamado(Long chamadoId, String solucao) {
        currentUser.requireTech();
        Chamado chamado = chamadoQueryService.buscarPorId(chamadoId);
        chamado.concluir(solucao);
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado editarChamado(Long id, EditarChamadoDTO dto) {
        Chamado chamado = chamadoQueryService.buscarPorId(id);
        currentUser.requireOwnerOrTech(chamado);
        chamado.editar(dto.titulo(), dto.descricao(), dto.categoria(), dto.prioridade());
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado reabrirChamado(Long chamadoId, String motivo) {
        Chamado chamado = chamadoQueryService.buscarPorId(chamadoId);
        currentUser.requireOwnerOrTech(chamado);
        chamado.reabrir(motivo);
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado cancelarChamado(Long chamadoId, String motivo) {
        Chamado chamado = chamadoQueryService.buscarPorId(chamadoId);
        currentUser.requireOwnerOrTech(chamado);
        chamado.cancelar(motivo);
        return chamadoRepository.save(chamado);
    }
}
