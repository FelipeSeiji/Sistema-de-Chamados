package com.tvdiario.sistema_chamado.domain.model.infrastructure;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass 
@EntityListeners (AuditingEntityListener.class)
@Getter 
@Setter
public abstract class EntidadeAuditavel {
    @CreatedDate 
    @Column 
    private LocalDateTime criadoEm;

    @LastModifiedBy 
    @Column 
    private LocalDateTime atualizadoEm;
}
