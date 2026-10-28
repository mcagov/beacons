# Build the service
FROM docker.io/library/gradle:jdk17 AS build
WORKDIR /opt/app
COPY . ./
RUN ./gradlew clean assemble

# Run the service
FROM docker.io/library/eclipse-temurin:24 AS beacons-service
WORKDIR /opt/app
COPY --from=build /opt/app/build/libs/*.jar app.jar

HEALTHCHECK --interval=30s --timeout=10s --retries=6 CMD ["curl", "--fail", "http://localhost:8080/spring-api/actuator/health"]

ENTRYPOINT ["java", "-jar", "app.jar"]
