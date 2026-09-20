# ================================================
# ETAPA 1: Build da aplicação com Maven
# ================================================
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

# Copia o wrapper do Maven e o pom.xml primeiro (cache de dependências)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Baixa as dependências (cache eficiente)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copia o código-fonte e compila
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# ================================================
# ETAPA 2: Imagem final leve apenas com o JRE
# ================================================
FROM eclipse-temurin:25-jre

WORKDIR /app

# Copia o .jar gerado na etapa de build
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta da aplicação
EXPOSE 8080

# Inicia a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
