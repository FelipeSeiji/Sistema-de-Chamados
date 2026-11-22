FROM node:24-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM eclipse-temurin:21-jdk AS backend
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn/ .mvn/
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src/ src/
COPY --from=frontend /frontend/dist/frontend/browser/ src/main/resources/static/
RUN ./mvnw package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN groupadd --system helpdesk && useradd --system --gid helpdesk helpdesk
COPY --from=backend /app/target/*.jar app.jar
USER helpdesk
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
