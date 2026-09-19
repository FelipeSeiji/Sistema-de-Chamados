package com.tvdiario.sistema_chamado.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tvdiario.sistema_chamado.dto.AtualizarChamadoDTO;
import com.tvdiario.sistema_chamado.dto.EditarChamadoDTO;
import com.tvdiario.sistema_chamado.dto.MotivoDTO;
import com.tvdiario.sistema_chamado.model.Chamado;
import com.tvdiario.sistema_chamado.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.service.ChamadoService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChamadoController {

    private final ChamadoService chamadoService;

    @PostMapping
    public ResponseEntity<Chamado> abrirChamado(
            @RequestBody Chamado chamado,
            @RequestParam UUID usuarioId) {
        Chamado criado = chamadoService.abrirChamado(chamado, usuarioId);
        return ResponseEntity.created(URI.create("/api/chamados/" + criado.getId())).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<Chamado>> listar(
            @RequestParam(required = false) StatusChamado status,
            @RequestParam(required = false) CategoriaChamado categoria) {
        if (status != null) {
            return ResponseEntity.ok(chamadoService.listarPorStatus(status));
        }
        if (categoria != null) {
            return ResponseEntity.ok(chamadoService.listarPorCategoria(categoria));
        }
        return ResponseEntity.ok(chamadoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chamado> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(chamadoService.buscarPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Chamado>> listarPorUsuario(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(chamadoService.listarPorUsuario(usuarioId));
    }

    @PostMapping("/{id}/assumir")
    public ResponseEntity<Chamado> assumir(@PathVariable UUID id) {
        return ResponseEntity.ok(chamadoService.assumirChamado(id));
    }

    @PutMapping("/{id}/atualizar")
    public ResponseEntity<Chamado> atualizar(
            @PathVariable UUID id,
            @RequestBody AtualizarChamadoDTO dto) {
        return ResponseEntity.ok(chamadoService.atualizarChamado(id, dto.solucao(), dto.status()));
    }

    @PostMapping("/{id}/concluir")
    public ResponseEntity<Chamado> concluir(
            @PathVariable UUID id,
            @RequestBody MotivoDTO dto) {
        return ResponseEntity.ok(chamadoService.concluirChamado(id, dto.motivo()));
    }

    @PutMapping("/{id}/editar")
    public ResponseEntity<Chamado> editar(
            @PathVariable UUID id,
            @RequestBody EditarChamadoDTO dto) {
        return ResponseEntity.ok(chamadoService.editarChamado(
                id, dto.titulo(), dto.descricao(), dto.categoria(), dto.prioridade()));
    }

    @PostMapping("/{id}/reabrir")
    public ResponseEntity<Chamado> reabrir(
            @PathVariable UUID id,
            @RequestBody(required = false) MotivoDTO dto) {
        String motivo = dto != null ? dto.motivo() : null;
        return ResponseEntity.ok(chamadoService.reabrirChamado(id, motivo));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Chamado> cancelar(
            @PathVariable UUID id,
            @RequestBody(required = false) MotivoDTO dto) {
        String motivo = dto != null ? dto.motivo() : null;
        return ResponseEntity.ok(chamadoService.cancelarChamado(id, motivo));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<Map<String, Long>> obterEstatisticas() {
        return ResponseEntity.ok(chamadoService.obterEstatisticas());
    }
}
