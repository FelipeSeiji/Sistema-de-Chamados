package com.tvdiario.sistema_chamado.domain.controller;

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

import com.tvdiario.sistema_chamado.domain.dto.LoginDTO;
import com.tvdiario.sistema_chamado.domain.dto.TrocarSenhaDTO;
import com.tvdiario.sistema_chamado.domain.model.Usuario;
import com.tvdiario.sistema_chamado.domain.model.enums.Departamento;
import com.tvdiario.sistema_chamado.domain.service.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody @Valid Usuario usuario) {
        Usuario criado = usuarioService.criarUsuario(usuario);
        
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criado.getId())
                .toUri();
                
        return ResponseEntity.created(uri).body(criado);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody @Valid LoginDTO loginDTO) {
        Usuario usuario = usuarioService.autenticar(loginDTO);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar(
            @RequestParam(required = false) Departamento departamento) {
        if (departamento != null) {
            return ResponseEntity.ok(usuarioService.listarPorDepartamento(departamento));
        }
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/tecnicos")
    public ResponseEntity<List<Usuario>> listarTecnicos() {
        return ResponseEntity.ok(usuarioService.listarTecnicos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable UUID id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, usuario));
    }

    @PutMapping("/{id}/trocar-senha")
    public ResponseEntity<Void> trocarSenha(@PathVariable UUID id, @RequestBody @Valid TrocarSenhaDTO dto) {
        usuarioService.trocarSenha(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(@PathVariable UUID id, @RequestParam String novaSenha) {
        usuarioService.redefinirSenha(id, novaSenha);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        usuarioService.excluirUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/importar")
    public ResponseEntity<List<Usuario>> importar(@RequestBody List<Usuario> usuarios) {
        return ResponseEntity.ok(usuarioService.importarUsuarios(usuarios));
    }
}