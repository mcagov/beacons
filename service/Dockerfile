# Build the service
FROM gradle:jdk11-hotspot AS build
WORKDIR /opt/app
COPY . ./
RUN ./gradlew clean assemble

# Run the service
FROM adoptopenjdk:16-jre-hotspot AS beacons-service
WORKDIR /opt/app
COPY --from=build /opt/app/build/libs/*.jar app.jar

HEALTHCHECK --interval=30s --timeout=10s --retries=6 CMD curl --fail http://localhost:8080/spring-api/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
