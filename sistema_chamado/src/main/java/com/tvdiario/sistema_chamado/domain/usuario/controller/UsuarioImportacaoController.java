package com.tvdiario.sistema_chamado.domain.usuario.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tvdiario.sistema_chamado.domain.usuario.dto.CriarUsuarioDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.UsuarioResponseDTO;
import com.tvdiario.sistema_chamado.domain.usuario.mapper.UsuarioMapper;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.service.UsuarioImportacaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/usuarios/importacao")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UsuarioImportacaoController {

    private final UsuarioImportacaoService usuarioImportacaoService;
    private final UsuarioMapper usuarioMapper;

    @PostMapping
    public ResponseEntity<List<UsuarioResponseDTO>> importar(@RequestBody List<@Valid CriarUsuarioDTO> dtos) {
        List<Usuario> usuariosParaImportar = dtos.stream()
                .map(usuarioMapper::toEntity)
                .toList();

        List<Usuario> importados = usuarioImportacaoService.importarUsuarios(usuariosParaImportar);
        return ResponseEntity.ok(usuarioMapper.toDTOList(importados));
    }
}