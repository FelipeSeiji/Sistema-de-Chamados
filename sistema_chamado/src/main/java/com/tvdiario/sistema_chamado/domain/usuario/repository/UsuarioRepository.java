package com.tvdiario.sistema_chamado.domain.usuario.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.UsuarioTipo;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID>, JpaSpecificationExecutor<Usuario>{

    Optional<Usuario> findByEmailIgnoreCase(String email);
    Optional<Usuario> findByUsername(String username);
    
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsername(String username);
    
    List<Usuario> findByUsuarioTipo(UsuarioTipo usuarioTipo);
    List<Usuario> findByDepartamento(Departamento departamento);
    
    List<Usuario> findAllByOrderByNomeAsc();
}