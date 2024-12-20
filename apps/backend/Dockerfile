FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

COPY settings.gradle.kts .
COPY build.gradle.kts .
COPY gradle.properties* ./
COPY gradle/ gradle/

COPY resource/ resource/

RUN gradle :resource:build --no-daemon

FROM gradle:8.5-jdk17 AS dev

WORKDIR /app

RUN mkdir -p /app/.gradle && \
    chown -R gradle:gradle /app

USER gradle

ENV GRADLE_USER_HOME=/app/.gradle
ENV SPRING_PROFILES_ACTIVE=dev
ENV SPRING_DEVTOOLS_RESTART_ENABLED=true
ENV SPRING_DEVTOOLS_LIVERELOAD_ENABLED=true

CMD ["gradle", ":resource:bootRun", "--continuous", "--no-daemon", "-Dspring-boot.run.jvmArguments='-XX:TieredStopAtLevel=1 -noverify'"]

FROM eclipse-temurin:17-jre-jammy AS prod

WORKDIR /app

RUN useradd -m spring

COPY --from=builder --chown=spring:spring /app/resource/build/libs/*.jar app.jar

USER spring

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
