package com.tvdiario.sistema_chamado.infrastructure;

@org.springframework.web.bind.annotation.RestController
public class HealthController {
    @org.springframework.web.bind.annotation.GetMapping("/api/health")
    public java.util.Map<String, String> health() {
        return java.util.Map.of("status", "UP", "version", "1.0.0-beta.1");
    }
}
