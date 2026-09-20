package com.tvdiario.sistema_chamado.domain.usuario.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.tvdiario.sistema_chamado.domain.usuario.dto.AtualizarUsuarioDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.CriarUsuarioDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.UsuarioResponseDTO;
import com.tvdiario.sistema_chamado.domain.usuario.mapper.UsuarioMapper;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.usuario.service.UsuarioCommandService;
import com.tvdiario.sistema_chamado.domain.usuario.service.UsuarioQueryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioCommandService usuarioCommandService;
    private final UsuarioQueryService usuarioQueryService;
    private final UsuarioMapper usuarioMapper;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(@RequestBody @Valid CriarUsuarioDTO dto) {
        Usuario entity = usuarioMapper.toEntity(dto);
        Usuario criado = usuarioCommandService.criarUsuario(entity);
        
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criado.getId())
                .toUri();
                
        return ResponseEntity.created(uri).body(usuarioMapper.toDTO(criado));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> buscarUsuarios(
            @RequestParam(required = false) Departamento departamento,
            @RequestParam(required = false) String termo) {
        
        List<UsuarioResponseDTO> usuarios = usuarioQueryService.buscarUsuarios(departamento, termo);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/tecnicos")
    public ResponseEntity<List<UsuarioResponseDTO>> listarTecnicos() {
        List<Usuario> tecnicos = usuarioQueryService.listarTecnicos();
        return ResponseEntity.ok(usuarioMapper.toDTOList(tecnicos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable UUID id) {
        Usuario usuario = usuarioQueryService.buscarPorId(id);
        return ResponseEntity.ok(usuarioMapper.toDTO(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizar(
            @PathVariable UUID id, 
            @RequestBody @Valid AtualizarUsuarioDTO dto) {
        
        Usuario atualizado = usuarioCommandService.atualizarUsuario(id, dto);
        return ResponseEntity.ok(usuarioMapper.toDTO(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        usuarioCommandService.excluirUsuario(id);
        return ResponseEntity.noContent().build();
    }
}