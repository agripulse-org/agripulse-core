FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests

FROM eclipse-temurin:21-jre-jammy
ARG DEPENDENCY=/workspace/app/target/api-0.0.1-SNAPSHOT.jar
COPY --from=build ${DEPENDENCY} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
