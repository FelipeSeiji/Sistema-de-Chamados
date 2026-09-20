package com.tvdiario.sistema_chamado.domain.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.domain.dto.AtualizarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.dto.CriarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.dto.EditarChamadoDTO;
import com.tvdiario.sistema_chamado.common.exception.EntidadeNaoEncontradaException;
import com.tvdiario.sistema_chamado.domain.model.Chamado;
import com.tvdiario.sistema_chamado.domain.model.Usuario;
import com.tvdiario.sistema_chamado.domain.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.domain.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.domain.repository.ChamadoRepository;
import com.tvdiario.sistema_chamado.domain.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChamadoService {

    private final ChamadoRepository chamadoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Chamado abrirChamado(CriarChamadoDTO dto, UUID usuarioId) {
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

    @Transactional(readOnly = true)
    public Chamado buscarPorId(UUID id) {
        return chamadoRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Chamado não encontrado para o ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarTodos() {
        return chamadoRepository.findAllByOrderByCriadoEmDesc();
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarPorUsuario(UUID usuarioId) {
        return chamadoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarPorStatus(StatusChamado status) {
        return chamadoRepository.findByStatusOrderByCriadoEmDesc(status);
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarPorCategoria(CategoriaChamado categoria) {
        return chamadoRepository.findByCategoria(categoria);
    }

    @Transactional
    public Chamado assumirChamado(UUID chamadoId) {
        Chamado chamado = buscarPorId(chamadoId);
        chamado.assumir();
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado atualizarChamado(UUID chamadoId, AtualizarChamadoDTO dto) {
        Chamado chamado = buscarPorId(chamadoId);
        if (dto.solucao() != null && !dto.solucao().isBlank()) {
            chamado.setSolucao(dto.solucao().trim());
        }
        if (dto.status() != null) {
            chamado.setStatus(dto.status());
        }
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado concluirChamado(UUID chamadoId, String solucao) {
        Chamado chamado = buscarPorId(chamadoId);
        chamado.concluir(solucao);
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado editarChamado(UUID id, EditarChamadoDTO dto) {
        Chamado chamado = buscarPorId(id);
        chamado.editar(dto.titulo(), dto.descricao(), dto.categoria(), dto.prioridade());
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado reabrirChamado(UUID chamadoId, String motivo) {
        Chamado chamado = buscarPorId(chamadoId);
        chamado.reabrir(motivo);
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado cancelarChamado(UUID chamadoId, String motivo) {
        Chamado chamado = buscarPorId(chamadoId);
        chamado.cancelar(motivo);
        return chamadoRepository.save(chamado);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> obterEstatisticas() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", chamadoRepository.count());
        stats.put("abertos", chamadoRepository.countByStatus(StatusChamado.ABERTO));
        stats.put("emAtendimento", chamadoRepository.countByStatus(StatusChamado.EM_ATENDIMENTO));
        stats.put("concluidos", chamadoRepository.countByStatus(StatusChamado.CONCLUIDO));
        stats.put("cancelados", chamadoRepository.countByStatus(StatusChamado.CANCELADO));
        return stats;
    }
}