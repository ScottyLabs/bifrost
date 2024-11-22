package com.scottylabs.auth.service


import com.scottylabs.auth.config.properties.AuthProperties
import org.slf4j.LoggerFactory
import org.springframework.security.oauth2.core.AuthorizationGrantType
import org.springframework.security.oauth2.core.ClientAuthenticationMethod
import org.springframework.security.oauth2.core.oidc.OidcScopes
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings
import org.springframework.stereotype.Service
import java.util.*

@Service
class ClientService(private val authProperties: AuthProperties) {

  private val logger = LoggerFactory.getLogger(ClientService::class.java)

  fun createRegisteredClientRepository(): RegisteredClientRepository {
    val client = RegisteredClient.withId(UUID.randomUUID().toString())
      .clientId(authProperties.clientId)
      .clientSecret("{noop}${authProperties.clientSecret}") // Use proper password encoding in production
      .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
      .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
      .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
      .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
      .redirectUri(authProperties.redirectUris[0])
      .scope(OidcScopes.OPENID)
      .scope(OidcScopes.PROFILE)
      .clientSettings(
        ClientSettings.builder()
          .requireAuthorizationConsent(true)
          .requireProofKey(false)
          .build()
      )
      .tokenSettings(
        TokenSettings.builder()
          .accessTokenTimeToLive(authProperties.accessTokenTtl)
          .refreshTokenTimeToLive(authProperties.refreshTokenTtl)
          .reuseRefreshTokens(false)
          .build()
      )
      .build()


    logger.info("Client created with scopes: ${client.scopes}")

    val repo = InMemoryRegisteredClientRepository(client)
    // Verify client can be retrieved
    val savedClient = repo.findByClientId(client.clientId)
    logger.info("Client retrieved from repo: ${savedClient != null}")


    return InMemoryRegisteredClientRepository(client)
  }
}
