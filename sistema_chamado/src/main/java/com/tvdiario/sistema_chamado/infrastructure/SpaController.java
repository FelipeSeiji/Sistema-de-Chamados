package com.tvdiario.sistema_chamado.infrastructure;

@org.springframework.stereotype.Controller
public class SpaController {
    @org.springframework.web.bind.annotation.GetMapping({"/login", "/cadastro", "/dashboard", "/novo-chamado",
        "/ver-chamado/{id}", "/editar-chamado/{id}", "/trocar-senha", "/esqueci-senha", "/admin-usuarios", "/relatorios"})
    public String index() { return "forward:/index.html"; }
}
