package com.scottylabs.auth.service

import com.scottylabs.auth.config.properties.AuthProperties
import com.scottylabs.auth.config.properties.ClientConfig
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.core.AuthorizationGrantType
import org.springframework.security.oauth2.core.ClientAuthenticationMethod
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings
import org.springframework.stereotype.Service
import java.util.*

@Service
class ClientService(private val authProperties: AuthProperties, private val passwordEncoder: PasswordEncoder) {
  private val logger = LoggerFactory.getLogger(ClientService::class.java)

  fun createRegisteredClientRepository(): RegisteredClientRepository {
    val clients = authProperties.clients.map { (_, config) ->
      createRegisteredClient(config)
    }

    logger.info("Created ${clients.size} clients: ${clients.map { it.clientId }}")

    return InMemoryRegisteredClientRepository(clients)
  }

  private fun createRegisteredClient(config: ClientConfig): RegisteredClient {
    return RegisteredClient.withId(UUID.randomUUID().toString())
      .clientId(config.clientId)
      .clientSecret(passwordEncoder.encode(config.clientSecret))
      .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
      .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
      .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
      .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
      .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
      .apply {
        config.redirectUris.forEach { redirectUri(it) }
        config.allowedScopes.forEach { scope(it) }
      }
      .clientSettings(
        ClientSettings.builder()
          .requireAuthorizationConsent(config.requireAuthorizationConsent)
          .requireProofKey(config.requireProofKey)
          .build()
      )
      .tokenSettings(
        TokenSettings.builder()
          .accessTokenTimeToLive(
            config.accessTokenTtl ?: authProperties.accessTokenTtl
          )
          .refreshTokenTimeToLive(
            config.refreshTokenTtl ?: authProperties.refreshTokenTtl
          )
          .reuseRefreshTokens(false)
          .build()
      )
      .build()
  }
}
