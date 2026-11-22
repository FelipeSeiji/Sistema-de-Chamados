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
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody @Valid LoginDTO loginDTO,
            jakarta.servlet.http.HttpServletRequest request) {
        Usuario usuario = authService.autenticar(loginDTO);
        var context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
            usuario.getId().toString(), null, java.util.List.of(
                new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + usuario.getUsuarioTipo().name()))));
        request.getSession();
        request.changeSessionId();
        org.springframework.security.core.context.SecurityContextHolder.setContext(context);
        new org.springframework.security.web.context.HttpSessionSecurityContextRepository().saveContext(context, request, null);
        return ResponseEntity.ok(usuarioMapper.toDTO(usuario));
    }

    private final com.tvdiario.sistema_chamado.infrastructure.security.CurrentUser currentUser;

    @org.springframework.web.bind.annotation.GetMapping("/csrf")
    public java.util.Map<String, String> csrf(org.springframework.security.web.csrf.CsrfToken token) {
        return java.util.Map.of("token", token.getToken());
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public UsuarioResponseDTO me() {
        return usuarioMapper.toDTO(currentUser.get());
    }

    @PutMapping("/{id}/trocar-senha")
    public ResponseEntity<Void> trocarSenha(@PathVariable UUID id, @RequestBody @Valid TrocarSenhaDTO dto) {
        currentUser.requireSelfOrAdmin(id);
        authService.trocarSenha(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(@PathVariable UUID id, @RequestParam String novaSenha) {
        currentUser.requireAdmin();
        authService.redefinirSenha(id, novaSenha);
        return ResponseEntity.noContent().build();
    }
}
