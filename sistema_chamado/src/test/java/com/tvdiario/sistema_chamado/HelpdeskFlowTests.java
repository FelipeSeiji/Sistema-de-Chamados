package com.tvdiario.sistema_chamado;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(properties = {"app.demo.enabled=true", "spring.datasource.url=jdbc:h2:mem:flows;DB_CLOSE_DELAY=-1"})
@AutoConfigureMockMvc
class HelpdeskFlowTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    private MockHttpSession login(String email) throws Exception {
        var result = mvc.perform(post("/api/v1/auth/login").with(csrf()).contentType("application/json")
            .content("{\"email\":\"" + email + "\",\"senha\":\"Demo@12345\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.password").doesNotExist()).andReturn();
        return (MockHttpSession) result.getRequest().getSession(false);
    }

    @Test void anonymousAccessAndCsrfAreEnforced() throws Exception {
        mvc.perform(get("/api/chamados")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/health")).andExpect(status().isOk());
        mvc.perform(post("/api/v1/auth/login").contentType("application/json")
            .content("{\"email\":\"tecnico@chamados.demo\",\"senha\":\"Demo@12345\"}"))
            .andExpect(status().isForbidden());
        mvc.perform(post("/api/v1/auth/login").with(csrf()).contentType("application/json")
            .content("{\"email\":\"tecnico@chamados.demo\",\"senha\":\"incorreta\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test void ticketLifecycleAndSessionLogout() throws Exception {
        var session = login("tecnico@chamados.demo");
        var me = mvc.perform(get("/api/v1/auth/me").session(session)).andExpect(status().isOk()).andReturn();
        String userId = json.readTree(me.getResponse().getContentAsString()).get("id").asText();
        var created = mvc.perform(post("/api/chamados").param("usuarioId", userId).session(session).with(csrf())
            .contentType("application/json").content("{\"titulo\":\"Chamado de teste\",\"descricao\":\"Validar fluxo completo\",\"categoria\":\"TI_SOFTWARE\",\"prioridade\":\"MEDIA\"}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.usuarioNome").isNotEmpty()).andReturn();
        String id = json.readTree(created.getResponse().getContentAsString()).get("id").asText();
        mvc.perform(put("/api/chamados/" + id + "/editar").session(session).with(csrf()).contentType("application/json")
            .content("{\"titulo\":\"Título editado\",\"prioridade\":\"ALTA\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.titulo").value("Título editado"));
        mvc.perform(post("/api/chamados/" + id + "/assumir").session(session).with(csrf()))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("EM_ATENDIMENTO"));
        mvc.perform(post("/api/chamados/" + id + "/concluir").session(session).with(csrf()).contentType("application/json")
            .content("{\"motivo\":\"Resolvido e validado\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CONCLUIDO"));
        mvc.perform(post("/api/chamados/" + id + "/reabrir").session(session).with(csrf()).contentType("application/json")
            .content("{\"motivo\":\"Nova ocorrência\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ABERTO"));
        mvc.perform(post("/api/chamados/" + id + "/cancelar").session(session).with(csrf()).contentType("application/json").content("{}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CANCELADO"));
        mvc.perform(post("/api/v1/auth/logout").session(session).with(csrf())).andExpect(status().isNoContent());
        assertTrue(session.isInvalid());
    }

    @Test void publicRegistrationCannotGrantAdminAndPasswordsCanBeChanged() throws Exception {
        var result = mvc.perform(post("/api/v1/usuarios").with(csrf()).contentType("application/json")
            .content("{\"nome\":\"Teste cadastro\",\"username\":\"teste_cadastro\",\"email\":\"cadastro@example.test\",\"password\":\"Demo@12345\",\"departamento\":\"TECNOLOGIA\",\"usuarioTipo\":\"ADMINISTRADOR\"}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.usuarioTipo").value("USUARIO")).andReturn();
        String id = json.readTree(result.getResponse().getContentAsString()).get("id").asText();
        var session = login("cadastro@example.test");
        mvc.perform(get("/api/v1/usuarios").session(session)).andExpect(status().isForbidden());
        mvc.perform(get("/api/chamados").session(session)).andExpect(status().isOk()).andExpect(content().json("[]"));
        mvc.perform(get("/api/chamados/1").session(session)).andExpect(status().isForbidden());
        mvc.perform(post("/api/chamados/1/assumir").session(session).with(csrf())).andExpect(status().isForbidden());
        mvc.perform(put("/api/v1/auth/" + id + "/trocar-senha").session(session).with(csrf()).contentType("application/json")
            .content("{\"senhaAtual\":\"Demo@12345\",\"novaSenha\":\"Nova@12345\"}"))
            .andExpect(status().isNoContent());
        mvc.perform(post("/api/v1/auth/login").with(csrf()).contentType("application/json")
            .content("{\"email\":\"cadastro@example.test\",\"senha\":\"Nova@12345\"}"))
            .andExpect(status().isOk());
    }
}
