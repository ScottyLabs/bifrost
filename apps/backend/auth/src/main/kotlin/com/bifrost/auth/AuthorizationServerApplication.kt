package com.bifrost.auth

import com.bifrost.auth.config.properties.AuthProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication(
  scanBasePackages = ["com.bifrost.auth"]
)
@EnableConfigurationProperties(AuthProperties::class)
class AuthServerApplication

fun main(args: Array<String>) {
  runApplication<AuthServerApplication>(*args)
}
