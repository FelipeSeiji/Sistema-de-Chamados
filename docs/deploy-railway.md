# Publicar o Sistema de Chamados do zero no Railway

O deploy não foi realizado: o Railway conectado informou que o período de teste expirou e exige um plano ativo. A preparação abaixo deve ser aplicada a um **projeto novo e exclusivo para este sistema**.

## Preparar o repositório

Envie os arquivos desta versão ao seu repositório individual no GitHub. O remoto atualmente configurado é `FelipeSeiji/Sistema-de-Chamados`; confirme que esse é o repositório da pessoa que entregará a atividade ou use um repositório próprio.

## Criar a infraestrutura

1. Em uma conta Railway com plano ativo, escolha **New Project → Empty Project** e dê o nome `sistema-de-chamados`.
2. Dentro desse novo projeto, adicione um banco **PostgreSQL**. Mantenha seu armazenamento persistente.
3. Adicione um serviço da aplicação conectado ao repositório do GitHub e à branch que contém esta versão.
4. Configure **Root Directory** como `/sistema_chamado`.
5. Configure **Railway Config File** como `/sistema_chamado/railway.json`.
6. Use o Dockerfile do diretório da aplicação. Ele constrói o Angular e o inclui no JAR; não é necessário um serviço separado para o frontend.

O caminho do arquivo de configuração é absoluto em relação ao repositório, mesmo quando há Root Directory. Consulte a [documentação oficial de monorepos do Railway](https://docs.railway.com/deployments/monorepo#deploying-an-isolated-monorepo).

## Variáveis da aplicação

Considerando que o serviço de banco se chama `Postgres`, configure no serviço da aplicação:

```dotenv
SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
DEMO_ENABLED=true
COOKIE_SECURE=true
```

Se o nome do serviço de banco for diferente, ajuste as referências. Não configure `spring.datasource.driverClassName`: o driver é detectado pela URL JDBC. O Railway fornece `PORT` e a aplicação a utiliza automaticamente.

## Publicar e conferir

1. Inicie o deploy e aguarde o healthcheck `/api/health` ficar saudável.
2. Gere um domínio público HTTPS no serviço da aplicação.
3. Abra o domínio em uma janela anônima e faça login com `tecnico@chamados.demo` / `Demo@12345`.
4. Abra um chamado, consulte seus detalhes, inicie o atendimento e conclua com uma solução.
5. Faça logout, crie uma conta própria e verifique que ela só enxerga os próprios chamados.
6. Atualize a página autenticada para validar a restauração da sessão.
7. Reinicie o serviço e confirme que os chamados permanecem no PostgreSQL.
8. Preencha a URL pública no README e gere novamente o ZIP.

A rota `/api/health` deve responder `{"status":"UP","version":"1.0.0-beta.1"}`. A ordem das propriedades pode variar. A sessão dura até 30 minutos de inatividade; após reiniciar a aplicação, é necessário entrar novamente.

## Texto para entregar na disciplina

```text
Repositório individual: [cole aqui o link do seu repositório com esta versão]
Aplicação publicada: [cole aqui a URL HTTPS validada]
Versão: 1.0.0-beta.1
Login de demonstração: tecnico@chamados.demo
Senha: Demo@12345
O README contém a explicação do versionamento e o print real do dashboard.
```

Não envie o texto com os campos pendentes: a URL pública funcional é um dos critérios de avaliação.
