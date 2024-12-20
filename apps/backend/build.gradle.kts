plugins {
  id("org.springframework.boot") version "3.2.2" apply false
  id("io.spring.dependency-management") version "1.1.4" apply false
  kotlin("jvm") version "1.9.22" apply false
  kotlin("plugin.spring") version "1.9.22" apply false
  kotlin("plugin.jpa") version "1.9.22" apply false
}

allprojects {
  group = "com.bifrost"
  version = "0.0.1-SNAPSHOT"

  repositories {
    mavenCentral()
  }
}

subprojects {
  apply(plugin = "org.jetbrains.kotlin.jvm")
  apply(plugin = "org.jetbrains.kotlin.plugin.spring")
  apply(plugin = "org.springframework.boot")
  apply(plugin = "io.spring.dependency-management")

  tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
      freeCompilerArgs += "-Xjsr305=strict"
      jvmTarget = "17"
    }
  }

  tasks.withType<Test> {
    useJUnitPlatform()
  }

  // Configure Java compatibility through the base plugin
  configure<JavaPluginExtension> {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}

tasks.withType<Jar> {
  manifest {
    attributes(
      "Main-Class" to "com.bifrost.resource.ResourceServerApplicationKt"
    )
  }
  // This line of code recursively collects and copies all of a project's files
  // and adds them to the JAR itself. One can extend this task, to skip certain
  // files or particular types at will
  from({
    project.configurations.getByName("runtimeClasspath").map { file ->
      if (file.isDirectory) file else zipTree(file)
    }
  })
}
