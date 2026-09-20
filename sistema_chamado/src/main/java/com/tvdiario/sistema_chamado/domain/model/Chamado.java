package com.tvdiario.sistema_chamado.domain.model;

import java.util.UUID;

import com.tvdiario.sistema_chamado.common.exception.RegraNegocioException;
import com.tvdiario.sistema_chamado.domain.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.domain.model.enums.Prioridade;
import com.tvdiario.sistema_chamado.domain.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.domain.model.infrastructure.EntidadeAuditavel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "TB_CHAMADO")
@Getter 
@Setter 
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Chamado extends EntidadeAuditavel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String solucao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CategoriaChamado categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusChamado status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Prioridade prioridade;

    @ToString.Exclude
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public void inicializarChamadoPadrao(Usuario solicitante) {
        this.usuario = solicitante;
        if (this.status == null) this.status = StatusChamado.ABERTO;
        if (this.prioridade == null) this.prioridade = Prioridade.MEDIA;
        if (this.categoria == null) this.categoria = CategoriaChamado.TI_SOFTWARE;
    }

    public void assumir() {
        if (this.status != StatusChamado.ABERTO) {
            throw new RegraNegocioException("Apenas chamados com status ABERTO podem ser assumidos.");
        }
        this.status = StatusChamado.EM_ATENDIMENTO;
    }

    public void concluir(String solucaoTecnica) {
        if (solucaoTecnica == null || solucaoTecnica.isBlank()) {
            throw new RegraNegocioException("A solução técnica é obrigatória para concluir o chamado.");
        }
    this.solucao = solucaoTecnica.trim();
    this.status = StatusChamado.CONCLUIDO;
}

    public void editar(String novoTitulo, String novaDescricao, CategoriaChamado novaCategoria, Prioridade novaPrioridade) {
        if (this.status == StatusChamado.CONCLUIDO || this.status == StatusChamado.CANCELADO) {
            throw new RegraNegocioException("Não é possível editar um chamado já finalizado.");
        }
        if (novoTitulo != null && !novoTitulo.isBlank()) this.titulo = novoTitulo.trim();
        if (novaDescricao != null && !novaDescricao.isBlank()) this.descricao = novaDescricao.trim();
        if (novaCategoria != null) this.categoria = novaCategoria;
        if (novaPrioridade != null) this.prioridade = novaPrioridade;
    }

    public void reabrir(String motivo) {
        if (this.status != StatusChamado.CONCLUIDO && this.status != StatusChamado.CANCELADO) {
            throw new RegraNegocioException("Apenas chamados concluídos ou cancelados podem ser reabertos.");
        }
        this.status = StatusChamado.ABERTO;
        if (motivo != null && !motivo.isBlank()) {
            String historicoAnterior = this.solucao != null ? this.solucao + "\n" : "";
            this.solucao = historicoAnterior + "[Reaberto]: " + motivo.trim();
        }
    }

    public void cancelar(String motivo) {
        this.status = StatusChamado.CANCELADO;
        if (motivo != null && !motivo.isBlank()) {
            this.solucao = "[Cancelado]: " + motivo.trim();
        }
    }
}