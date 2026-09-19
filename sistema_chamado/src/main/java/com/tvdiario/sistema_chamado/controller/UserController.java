package com.tvdiario.sistema_chamado.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tvdiario.sistema_chamado.dto.LoginDTO;
import com.tvdiario.sistema_chamado.dto.TrocarSenhaDTO;
import com.tvdiario.sistema_chamado.model.Usuario;
import com.tvdiario.sistema_chamado.model.enums.Departamento;
import com.tvdiario.sistema_chamado.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario) {
        Usuario criado = userService.criarUsuario(usuario);
        return ResponseEntity.created(URI.create("/api/usuarios/" + criado.getId())).body(criado);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginDTO loginDTO) {
        Usuario usuario = userService.autenticar(loginDTO.email(), loginDTO.senha());
        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar(
            @RequestParam(required = false) Departamento departamento) {
        if (departamento != null) {
            return ResponseEntity.ok(userService.listarPorDepartamento(departamento));
        }
        return ResponseEntity.ok(userService.listarTodos());
    }

    @GetMapping("/tecnicos")
    public ResponseEntity<List<Usuario>> listarTecnicos() {
        return ResponseEntity.ok(userService.listarTecnicos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable UUID id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(userService.atualizarUsuario(id, usuario));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Usuario> alterarStatus(@PathVariable UUID id, @RequestParam StatusChamado status) {
        return ResponseEntity.ok(userService.alterarStatus(id, status));
    }

    @PutMapping("/{id}/trocar-senha")
    public ResponseEntity<Void> trocarSenha(@PathVariable UUID id, @RequestBody TrocarSenhaDTO dto) {
        userService.trocarSenha(id, dto.senhaAtual(), dto.novaSenha());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(@PathVariable UUID id, @RequestParam String novaSenha) {
        userService.redefinirSenha(id, novaSenha);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        userService.excluirUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/importar")
    public ResponseEntity<List<Usuario>> importar(@RequestBody List<Usuario> usuarios) {
        return ResponseEntity.ok(userService.importarUsuarios(usuarios));
    }
}
