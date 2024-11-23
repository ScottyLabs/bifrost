dependencies {
  implementation(project(":core"))
  implementation(project(":api"))

  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
}
