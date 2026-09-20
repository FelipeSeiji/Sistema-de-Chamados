package com.tvdiario.sistema_chamado.domain.chamados.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.Prioridade;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.StatusChamado;

public interface ChamadoRepository extends JpaRepository<Chamado, Long>, JpaSpecificationExecutor<Chamado> {

    long countByUsuarioId(UUID usuarioId);
    boolean existsByUsuarioId(UUID usuarioId);
    
    List<Chamado> findByUsuarioId(UUID usuarioId);
    List<Chamado> findByUsuarioIdOrderByCriadoEmDesc(UUID usuarioId);
    
    List<Chamado> findByStatus(StatusChamado status);
    List<Chamado> findByStatusOrderByCriadoEmDesc(StatusChamado status);
    List<Chamado> findByCategoria(CategoriaChamado categoria);
    List<Chamado> findByPrioridade(Prioridade prioridade);
    
    List<Chamado> findAllByOrderByCriadoEmDesc();
    long countByStatus(StatusChamado status);
}