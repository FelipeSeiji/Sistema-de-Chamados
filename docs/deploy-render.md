# Publicar no Render com PostgreSQL no Neon

A aplicação é distribuída em um único serviço Docker, contendo o frontend Angular e o backend Spring Boot. O PostgreSQL fica no Neon e mantém os dados quando o serviço do Render reinicia.

## Publicação desta entrega

- Aplicação: [sistema-de-chamados-pw2c.onrender.com](https://sistema-de-chamados-pw2c.onrender.com).
- Serviço: `sistema-de-chamados`, plano Free, região Virginia (US East).
- Banco: projeto exclusivo `sistema-de-chamados` no Neon, plano Free, PostgreSQL 18, região AWS US East 2 (Ohio).
- Versão: `1.0.0-beta.1`.
- Credencial pública de demonstração: `tecnico@chamados.demo` / `Demo@12345`.

O deploy foi concluído e o fluxo de cadastro, login, abertura, atendimento e conclusão de chamados foi validado no endereço público. O print do README foi capturado nesse ambiente. O repositório é privado e requer liberação de acesso ao avaliador.

## Serviço da aplicação

Use o repositório individual `FelipeSeiji/Sistema-de-Chamados`, branch `main`, e as configurações:

| Campo | Valor |
| --- | --- |
| Language / Runtime | Docker |
| Root Directory | `sistema_chamado` |
| Dockerfile Path | `./Dockerfile` |
| Docker Build Context | `.` |
| Instance Type | Free |
| Health Check Path | `/api/health` |

O arquivo `render.yaml` na raiz descreve essas configurações para criação por Blueprint. Ao usar o formulário de criação de Web Service, preencha os mesmos valores manualmente.

## Banco de dados e variáveis

Crie um projeto PostgreSQL exclusivo para este sistema no Neon. Copie host, nome do banco, usuário e senha para as variáveis secretas do serviço no Render; não grave essas credenciais no repositório.

```dotenv
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST_NEON/NOME_BANCO?sslmode=require
SPRING_DATASOURCE_USERNAME=USUARIO_NEON
SPRING_DATASOURCE_PASSWORD=SENHA_NEON
DEMO_ENABLED=true
COOKIE_SECURE=true
JAVA_TOOL_OPTIONS=-Xms64m -Xmx256m -XX:+UseSerialGC -XX:ActiveProcessorCount=2
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=3
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=0
```

Use o host pooled fornecido pelo Neon, quando disponível. A aplicação usa a variável `PORT` fornecida pelo Render. A memória da JVM e o número de conexões são limitados para a instância gratuita.

## Conferência após o deploy

1. Confira `/api/health`: deve retornar `status=UP` e `version=1.0.0-beta.1`.
2. Faça login com `tecnico@chamados.demo` / `Demo@12345`.
3. Abra um chamado, inicie o atendimento e conclua com uma solução.
4. Atualize a página para conferir a restauração da sessão.
5. Crie uma conta comum e confira que ela só consulta seus próprios chamados.
6. Registre a URL HTTPS pública no README e gere novamente o ZIP.

O serviço gratuito do Render suspende após 15 minutos sem tráfego e pode levar cerca de um minuto para voltar no primeiro acesso. Uma reinicialização exige novo login, mas os dados permanecem no PostgreSQL. O plano gratuito do Neon também possui cotas; acompanhe o consumo no painel.

Referências: [Docker no Render](https://render.com/docs/docker), [monorepos](https://render.com/docs/monorepo-support), [limites gratuitos do Render](https://render.com/docs/free).
