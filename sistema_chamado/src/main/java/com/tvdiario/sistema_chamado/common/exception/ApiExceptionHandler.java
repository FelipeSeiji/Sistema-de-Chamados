package com.tvdiario.sistema_chamado.common.exception;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<?> business(RegraNegocioException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(EntidadeNaoEncontradaException.class)
    public ResponseEntity<?> missing(EntidadeNaoEncontradaException ex) {
        return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
    }
}
