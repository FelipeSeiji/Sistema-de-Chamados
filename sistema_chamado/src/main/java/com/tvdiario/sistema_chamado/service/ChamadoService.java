package com.tvdiario.sistema_chamado.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.model.Chamado;
import com.tvdiario.sistema_chamado.model.Usuario;
import com.tvdiario.sistema_chamado.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.model.enums.Prioridade;
import com.tvdiario.sistema_chamado.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.repository.ChamadoRepository;
import com.tvdiario.sistema_chamado.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChamadoService {
    private final ChamadoRepository chamadoRepository;
    private final UserRepository userRepository;

    @Transactional
    public Chamado abrirChamado(Chamado chamado, UUID usuarioId) {
        if (chamado.getTitulo() == null || chamado.getTitulo().isBlank()) {
            throw new IllegalArgumentException("O titulo do chamado e obrigatorio.");
        }
        if (chamado.getDescricao() == null || chamado.getDescricao().isBlank()) {
            throw new IllegalArgumentException("A descricao do chamado e obrigatoria.");
        }

        Usuario solicitante = userRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario solicitante nao encontrado."));

        chamado.setUsuario(solicitante);
        chamado.setCriadoEm(chamado.getCriadoEm() != null ? chamado.getCriadoEm() : LocalDateTime.now());

        if (chamado.getStatus() == null) {
            chamado.setStatus(StatusChamado.ABERTO);
        }

        if (chamado.getPrioridade() == null) {
            chamado.setPrioridade(Prioridade.MEDIA);
        }

        if (chamado.getCategoria() == null) {
            chamado.setCategoria(CategoriaChamado.TI_SOFTWARE);
        }

        return chamadoRepository.save(chamado);
    }
    
    @Transactional(readOnly = true)
    public Chamado buscarPorId(UUID id) {
        return chamadoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chamado nao encontrado para o ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarTodos() {
        return chamadoRepository.findAllByOrderByCriadoEmDesc();
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarPorUsuario(UUID usuarioId) {
        return chamadoRepository.findByUsuario_IdOrderByCriadoEmDesc(usuarioId);
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

        if (chamado.getStatus() != StatusChamado.ABERTO) {
            throw new IllegalStateException("Chamado invalido ou ja assumido.");
        }

        chamado.setStatus(StatusChamado.EM_ATENDIMENTO);
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado atualizarChamado(UUID chamadoId, String solucao, StatusChamado novoStatus) {
        Chamado chamado = buscarPorId(chamadoId);

        if (solucao != null && !solucao.isBlank()) {
            chamado.setSolucao(solucao);
        }

        if (novoStatus != null) {
            chamado.setStatus(novoStatus);
        }

        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado concluirChamado(UUID chamadoId, String solucao) {
        if (solucao == null || solucao.isBlank()) {
            throw new IllegalArgumentException("A solucao tecnica e obrigatoria para concluir o chamado.");
        }

        Chamado chamado = buscarPorId(chamadoId);
        chamado.setSolucao(solucao);
        chamado.setStatus(StatusChamado.CONCLUIDO);
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado editarChamado(UUID id, String titulo, String descricao, CategoriaChamado categoria, Prioridade prioridade) {
        Chamado chamado = buscarPorId(id);

        if (chamado.getStatus() == StatusChamado.CONCLUIDO || chamado.getStatus() == StatusChamado.CANCELADO) {
            throw new IllegalStateException("Nao e possivel editar um chamado ja finalizado.");
        }

        if (titulo != null && !titulo.isBlank()) {
            chamado.setTitulo(titulo.trim());
        }
        if (descricao != null && !descricao.isBlank()) {
            chamado.setDescricao(descricao.trim());
        }
        if (categoria != null) {
            chamado.setCategoria(categoria);
        }
        if (prioridade != null) {
            chamado.setPrioridade(prioridade);
        }

        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado reabrirChamado(UUID chamadoId, String motivo) {
        Chamado chamado = buscarPorId(chamadoId);

        if (chamado.getStatus() != StatusChamado.CONCLUIDO && chamado.getStatus() != StatusChamado.CANCELADO) {
            throw new IllegalStateException("Apenas chamados concluidos ou cancelados podem ser reabertos.");
        }

        chamado.setStatus(StatusChamado.ABERTO);
        if (motivo != null && !motivo.isBlank()) {
            String solucaoAnterior = chamado.getSolucao() != null ? chamado.getSolucao() + "\n" : "";
            chamado.setSolucao(solucaoAnterior + "[Reaberto]: " + motivo);
        }

        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado cancelarChamado(UUID chamadoId, String motivo) {
        Chamado chamado = buscarPorId(chamadoId);
        chamado.setStatus(StatusChamado.CANCELADO);
        if (motivo != null && !motivo.isBlank()) {
            chamado.setSolucao("[Cancelado]: " + motivo);
        }
        return chamadoRepository.save(chamado);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> obterEstatisticas() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", chamadoRepository.count());
        stats.put("abertos", chamadoRepository.countByStatus(StatusChamado.ABERTO));
        stats.put("emAtendimento", chamadoRepository.countByStatus(StatusChamado.EM_ATENDIMENTO));
        stats.put("aguardando", chamadoRepository.countByStatus(StatusChamado.AGUARDANDO));
        stats.put("concluidos", chamadoRepository.countByStatus(StatusChamado.CONCLUIDO));
        stats.put("cancelados", chamadoRepository.countByStatus(StatusChamado.CANCELADO));
        return stats;
    }
}
