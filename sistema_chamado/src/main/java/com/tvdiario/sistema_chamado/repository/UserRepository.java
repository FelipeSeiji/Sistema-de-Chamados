package com.tvdiario.sistema_chamado.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tvdiario.sistema_chamado.model.Usuario;
import com.tvdiario.sistema_chamado.model.enums.Departamento;
import com.tvdiario.sistema_chamado.model.enums.UsuarioTipo;

@Repository
public interface UserRepository extends JpaRepository<Usuario, UUID> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByEmailIgnoreCase(String email);
    Optional<Usuario> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsername(String username);
    List<Usuario> findByUsuarioTipo(UsuarioTipo usuarioTipo);
    List<Usuario> findByDepartamento(Departamento departamento);
    List<Usuario> findAllByOrderByNomeAsc();
}
