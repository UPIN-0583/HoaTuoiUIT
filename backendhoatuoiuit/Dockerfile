# Giai đoạn 1: Build JAR
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Giai đoạn 2: Run JAR
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

COPY uploads/ uploads/

# Cho Render biết container mở port nào (Render sẽ connect vào)
EXPOSE 8080

# ✅ Dùng shell form để biến môi trường $PORT được gán
ENTRYPOINT java -Dserver.port=$PORT -jar /app/app.jar
