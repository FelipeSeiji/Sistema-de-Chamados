package com.tvdiario.sistema_chamado.domain.usuario.controller.auth;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tvdiario.sistema_chamado.domain.usuario.dto.LoginDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.TrocarSenhaDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.UsuarioResponseDTO;
import com.tvdiario.sistema_chamado.domain.usuario.mapper.UsuarioMapper;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UsuarioMapper usuarioMapper;

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody @Valid LoginDTO loginDTO) {
        Usuario usuario = authService.autenticar(loginDTO);
        return ResponseEntity.ok(usuarioMapper.toDTO(usuario));
    }

    @PutMapping("/{id}/trocar-senha")
    public ResponseEntity<Void> trocarSenha(@PathVariable UUID id, @RequestBody @Valid TrocarSenhaDTO dto) {
        authService.trocarSenha(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(@PathVariable UUID id, @RequestParam String novaSenha) {
        authService.redefinirSenha(id, novaSenha);
        return ResponseEntity.noContent().build();
    }
}