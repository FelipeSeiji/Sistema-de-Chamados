package com.tvdiario.sistema_chamado.domain.chamados.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tvdiario.sistema_chamado.domain.chamados.service.ChamadoDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chamados/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChamadoDashboardController {
    private final com.tvdiario.sistema_chamado.infrastructure.security.CurrentUser currentUser;

    private final ChamadoDashboardService chamadoDashboardService;

    @GetMapping("/estatisticas")
    public ResponseEntity<Map<String, Long>> obterEstatisticas() {
        currentUser.requireTech();
        return ResponseEntity.ok(chamadoDashboardService.obterEstatisticas());
    }
}
