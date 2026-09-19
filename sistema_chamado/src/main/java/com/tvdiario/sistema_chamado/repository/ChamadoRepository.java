package com.tvdiario.sistema_chamado.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tvdiario.sistema_chamado.model.Chamado;
import com.tvdiario.sistema_chamado.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.model.enums.Prioridade;
import com.tvdiario.sistema_chamado.model.enums.StatusChamado;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, UUID> {
    long countByUsuario_Id(UUID usuarioId);
    boolean existsByUsuario_Id(UUID usuarioId);
    List<Chamado> findByUsuario_Id(UUID usuarioId);
    List<Chamado> findByUsuario_IdOrderByCriadoEmDesc(UUID usuarioId);
    List<Chamado> findByStatus(StatusChamado status);
    List<Chamado> findByStatusOrderByCriadoEmDesc(StatusChamado status);
    List<Chamado> findByCategoria(CategoriaChamado categoria);
    List<Chamado> findByPrioridade(Prioridade prioridade);
    List<Chamado> findAllByOrderByCriadoEmDesc();
    long countByStatus(StatusChamado status);
}
