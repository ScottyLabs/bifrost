package com.scottylabs.auth.config.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.security.oauth2.core.oidc.OidcScopes
import java.time.Duration

@ConfigurationProperties(prefix = "auth")
data class AuthProperties(
  val issuerUri: String = "http://localhost:9000",
  val accessTokenTtl: Duration = Duration.ofMinutes(30),
  val refreshTokenTtl: Duration = Duration.ofDays(1),
  val corsAllowedOrigins: List<String> = listOf(
    "http://localhost:3000",
    "http://localhost:3001"
  ),
  val clients: Map<String, ClientConfig> = mapOf(
    "registration" to ClientConfig(
      clientId = "bifrost-registration",
      clientSecret = "registration-secret",
      redirectUris = listOf("http://localhost:3000/api/auth/callback/bifrost"),
      allowedScopes = listOf(
        OidcScopes.OPENID,
        OidcScopes.PROFILE,
        OidcScopes.EMAIL
      )
    ),
    "dashboard" to ClientConfig(
      clientId = "bifrost-dashboard",
      clientSecret = "dashboard-secret",
      redirectUris = listOf("http://localhost:3001/api/auth/callback/bifrost"),
      allowedScopes = listOf(
        OidcScopes.OPENID,
        OidcScopes.PROFILE,
        OidcScopes.EMAIL
      )
    )
  )
)

data class ClientConfig(
  val clientId: String,
  val clientSecret: String,
  val redirectUris: List<String>,
  val allowedScopes: List<String> = listOf(OidcScopes.OPENID, OidcScopes.PROFILE, OidcScopes.EMAIL),
  val requireAuthorizationConsent: Boolean = false,
  val requireProofKey: Boolean = false,
  val accessTokenTtl: Duration? = null,  // Falls back to global if null
  val refreshTokenTtl: Duration? = null   // Falls back to global if null
)
