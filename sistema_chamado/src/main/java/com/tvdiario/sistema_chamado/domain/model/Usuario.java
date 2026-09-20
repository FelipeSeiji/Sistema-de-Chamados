package com.tvdiario.sistema_chamado.domain.model;

import java.util.UUID;

import com.tvdiario.sistema_chamado.domain.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.model.enums.UsuarioTipo;
import com.tvdiario.sistema_chamado.domain.model.infrastructure.EntidadeAuditavel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "TB_USUARIO")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Usuario extends EntidadeAuditavel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Email
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @ToString.Exclude
    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Departamento departamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UsuarioTipo usuarioTipo;

    public void atualizarDados(Usuario novosDados) {
        if (novosDados.getNome() != null) this.nome = novosDados.getNome();
        if (novosDados.getUsername() != null) this.username = novosDados.getUsername();
        if (novosDados.getDepartamento() != null) {
            this.departamento = novosDados.getDepartamento();
        }
        if (novosDados.getUsuarioTipo() != null) this.usuarioTipo = novosDados.getUsuarioTipo();
    }
}