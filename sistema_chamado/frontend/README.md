# Frontend — Sistema de Chamados

A documentação da aplicação, o print do dashboard e a política de versionamento estão no [README principal](../../README.md).

Para desenvolvimento, use Node.js 24 e execute:

```bash
npm ci
npm start
```

A interface fica em http://localhost:4200. A API deve estar em http://localhost:8080; o proxy local encaminha as chamadas para ela.

Validação:

```bash
npm test -- --watch=false
npm run build
```

O Dockerfile principal, em `sistema_chamado/Dockerfile`, inclui o frontend no JAR servido pelo backend. O Dockerfile deste diretório é uma alternativa para servir somente o frontend via Nginx, configurando um upstream `app:8080`.
