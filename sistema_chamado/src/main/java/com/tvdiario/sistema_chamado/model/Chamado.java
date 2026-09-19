package com.tvdiario.sistema_chamado.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.tvdiario.sistema_chamado.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.model.enums.Prioridade;
import com.tvdiario.sistema_chamado.model.enums.StatusChamado;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TB_CHAMADO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chamado {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String solucao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaChamado categoria;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusChamado status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioridade prioridade;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}