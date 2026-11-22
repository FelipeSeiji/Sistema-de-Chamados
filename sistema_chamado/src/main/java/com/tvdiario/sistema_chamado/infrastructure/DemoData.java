package com.tvdiario.sistema_chamado.infrastructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;
import com.tvdiario.sistema_chamado.domain.usuario.model.enums.*;
import com.tvdiario.sistema_chamado.domain.usuario.repository.UsuarioRepository;
import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;
import com.tvdiario.sistema_chamado.domain.chamados.model.enums.*;
import com.tvdiario.sistema_chamado.domain.chamados.repository.ChamadoRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.demo.enabled", havingValue = "true")
public class DemoData implements CommandLineRunner {
    private final UsuarioRepository usuarios;
    private final ChamadoRepository chamados;
    private final PasswordEncoder passwords;

    @Override
    @Transactional
    public void run(String... args) {
        var tecnico = account("tecnico", "Técnico Demonstração", UsuarioTipo.TECNICO);
        var usuario = account("usuario", "Usuário Demonstração", UsuarioTipo.USUARIO);
        account("admin", "Administrador Demonstração", UsuarioTipo.ADMINISTRADOR);
        if (chamados.count() != 0) return;
        ticket("Computador da redação não liga", "Equipamento sem sinal de energia após troca de tomada.", usuario, CategoriaChamado.TI_EQUIPAMENTOS, Prioridade.ALTA, StatusChamado.ABERTO, null);
        ticket("Acesso ao sistema de edição", "Liberar acesso ao editor para uma nova estação de trabalho.", usuario, CategoriaChamado.TI_ACESSO, Prioridade.MEDIA, StatusChamado.EM_ATENDIMENTO, null);
        ticket("Oscilação de rede no estúdio", "Conexão apresenta quedas durante a transferência de arquivos.", tecnico, CategoriaChamado.ENG_REDE, Prioridade.URGENTE, StatusChamado.AGUARDANDO, null);
        ticket("Atualização do software de pauta", "Atualizar a estação para a versão homologada do software.", usuario, CategoriaChamado.TI_SOFTWARE, Prioridade.BAIXA, StatusChamado.CONCLUIDO, "Atualização instalada e validada com o solicitante.");
        ticket("Verificar retorno de áudio", "Ruído no retorno de áudio da bancada principal.", tecnico, CategoriaChamado.ENG_AUDIO, Prioridade.ALTA, StatusChamado.ABERTO, null);
    }

    private Usuario account(String login, String nome, UsuarioTipo tipo) {
        return usuarios.findByEmailIgnoreCase(login + "@chamados.demo").orElseGet(() ->
            usuarios.save(Usuario.builder().nome(nome).username("demo_" + login)
                .email(login + "@chamados.demo").password(passwords.encode("Demo@12345"))
                .departamento(Departamento.TECNOLOGIA).usuarioTipo(tipo).build()));
    }

    private void ticket(String titulo, String descricao, Usuario usuario, CategoriaChamado categoria,
            Prioridade prioridade, StatusChamado status, String solucao) {
        chamados.save(Chamado.builder().titulo(titulo).descricao(descricao).usuario(usuario)
            .categoria(categoria).prioridade(prioridade).status(status).solucao(solucao).build());
    }
}
