plugins {
  kotlin("jvm")
  kotlin("plugin.spring")
  kotlin("plugin.jpa")
  id("org.springframework.boot")
  id("io.spring.dependency-management")
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.datatype:jackson-datatype-jdk8")
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0")
  implementation("org.liquibase:liquibase-core")
  implementation(platform("software.amazon.awssdk:bom:2.21.0"))
  implementation("software.amazon.awssdk:s3")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("jakarta.validation:jakarta.validation-api:3.0.2")
  implementation("org.hibernate.validator:hibernate-validator:8.0.1.Final")
  implementation("org.glassfish:jakarta.el:4.0.2")

  runtimeOnly("org.postgresql:postgresql")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.security:spring-security-test")

  developmentOnly("org.springframework.boot:spring-boot-devtools")
}
