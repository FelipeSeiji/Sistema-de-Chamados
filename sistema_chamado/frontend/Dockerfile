# ================================================
# ETAPA 1: Build do Angular
# ================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências primeiro (melhor cache)
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Compila o projeto Angular para produção
RUN npm run build

# ================================================
# ETAPA 2: Servidor Nginx para servir os arquivos
# ================================================
FROM nginx:stable-alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados do Angular
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
