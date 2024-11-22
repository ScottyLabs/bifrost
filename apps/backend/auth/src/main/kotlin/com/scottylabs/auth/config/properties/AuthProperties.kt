package com.scottylabs.auth.config.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

@ConfigurationProperties(prefix = "auth")
data class AuthProperties(
  val issuerUri: String = "http://localhost:9000",  // Default value
  val accessTokenTtl: Duration = Duration.ofMinutes(30),  // Default 30 minutes
  val refreshTokenTtl: Duration = Duration.ofDays(1),     // Default 1 day

  // Optional additional properties you might want
  val clientId: String = "hackathon-client",
  val clientSecret: String = "secret",  // In production, this should be secured
  val redirectUris: List<String> = listOf("http://localhost:3000/api/auth/callback"),
  val corsAllowedOrigins: List<String> = listOf("http://localhost:3000")
)
