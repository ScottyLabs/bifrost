FROM gradle:8.11.1-jdk21 AS build

WORKDIR /app

COPY . .

RUN gradle build --no-daemon
