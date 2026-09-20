package com.tvdiario.sistema_chamado.domain.chamados.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvdiario.sistema_chamado.domain.chamados.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.domain.chamados.repository.ChamadoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChamadoDashboardService {
    private final ChamadoRepository chamadoRepository;

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