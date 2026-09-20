package com.tvdiario.sistema_chamado.domain.chamados.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tvdiario.sistema_chamado.domain.chamados.dto.ChamadoResponseDTO;
import com.tvdiario.sistema_chamado.domain.chamados.mapper.ChamadoMapper;
import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.CategoriaChamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.StatusChamado;
import com.tvdiario.sistema_chamado.domain.chamados.service.ChamadoQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChamadoQueryController {

    private final ChamadoQueryService chamadoQueryService;
    private final ChamadoMapper chamadoMapper;

    @GetMapping
    public ResponseEntity<List<ChamadoResponseDTO>> listar(
            @RequestParam(required = false) StatusChamado status,
            @RequestParam(required = false) CategoriaChamado categoria) {

        List<Chamado> lista;

        if (status != null) {
            lista = chamadoQueryService.listarPorStatus(status);
        } else if (categoria != null) {
            lista = chamadoQueryService.listarPorCategoria(categoria);
        } else {
            lista = chamadoQueryService.listarTodos();
        }

        return ResponseEntity.ok(chamadoMapper.toDTOList(lista));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChamadoResponseDTO> buscarPorId(@PathVariable Long id) {
        Chamado chamado = chamadoQueryService.buscarPorId(id);
        return ResponseEntity.ok(chamadoMapper.toDTO(chamado));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ChamadoResponseDTO>> listarPorUsuario(@PathVariable UUID usuarioId) {
        List<Chamado> lista = chamadoQueryService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(chamadoMapper.toDTOList(lista));
    }
}