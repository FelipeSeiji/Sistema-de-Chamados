package com.tvdiario.sistema_chamado.domain.chamados.controller;

import java.net.URI;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.tvdiario.sistema_chamado.domain.chamados.dto.AtualizarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.chamados.dto.ChamadoResponseDTO;
import com.tvdiario.sistema_chamado.domain.chamados.dto.CriarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.chamados.dto.EditarChamadoDTO;
import com.tvdiario.sistema_chamado.domain.chamados.mapper.ChamadoMapper;
import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;
import com.tvdiario.sistema_chamado.domain.chamados.service.ChamadoCommandService;
import com.tvdiario.sistema_chamado.domain.usuario.dto.MotivoDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChamadoCommandController {

    private final ChamadoCommandService chamadoCommandService;
    private final ChamadoMapper chamadoMapper;

    @PostMapping
    public ResponseEntity<ChamadoResponseDTO> abrirChamado(
            @RequestBody @Valid CriarChamadoDTO dto,
            @RequestParam UUID usuarioId) {

        Chamado criado = chamadoCommandService.abrirChamado(dto, usuarioId);
        ChamadoResponseDTO response = chamadoMapper.toDTO(criado);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

    @PostMapping("/{id}/assumir")
    public ResponseEntity<ChamadoResponseDTO> assumir(@PathVariable Long id) {
        Chamado chamado = chamadoCommandService.assumirChamado(id);
        return ResponseEntity.ok(chamadoMapper.toDTO(chamado));
    }

    @PutMapping("/{id}/atualizar")
    public ResponseEntity<ChamadoResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid AtualizarChamadoDTO dto) {
        Chamado chamado = chamadoCommandService.atualizarChamado(id, dto);
        return ResponseEntity.ok(chamadoMapper.toDTO(chamado));
    }

    @PostMapping("/{id}/concluir")
    public ResponseEntity<ChamadoResponseDTO> concluir(
            @PathVariable Long id,
            @RequestBody @Valid MotivoDTO dto) {
        Chamado chamado = chamadoCommandService.concluirChamado(id, dto.motivo());
        return ResponseEntity.ok(chamadoMapper.toDTO(chamado));
    }

    @PutMapping("/{id}/editar")
    public ResponseEntity<ChamadoResponseDTO> editar(
            @PathVariable Long id,
            @RequestBody @Valid EditarChamadoDTO dto) {
        Chamado chamado = chamadoCommandService.editarChamado(id, dto);
        return ResponseEntity.ok(chamadoMapper.toDTO(chamado));
    }

    @PostMapping("/{id}/reabrir")
    public ResponseEntity<ChamadoResponseDTO> reabrir(
            @PathVariable Long id,
            @RequestBody(required = false) MotivoDTO dto) {
        String motivo = dto != null ? dto.motivo() : null;
        Chamado chamado = chamadoCommandService.reabrirChamado(id, motivo);
        return ResponseEntity.ok(chamadoMapper.toDTO(chamado));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<ChamadoResponseDTO> cancelar(
            @PathVariable Long id,
            @RequestBody(required = false) MotivoDTO dto) {
        String motivo = dto != null ? dto.motivo() : null;
        Chamado chamado = chamadoCommandService.cancelarChamado(id, motivo);
        return ResponseEntity.ok(chamadoMapper.toDTO(chamado));
    }
}