package com.bifrost.auth.config

import com.bifrost.auth.config.properties.AuthProperties
import com.bifrost.auth.config.security.KeyConfig
import com.bifrost.auth.service.ClientService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings

@Configuration
class AuthorizationServerConfig(
  private val authProperties: AuthProperties,
  private val clientService: ClientService,
  private val keyConfig: KeyConfig
) {
  @Bean
  fun authorizationServerSettings(): AuthorizationServerSettings {
    return AuthorizationServerSettings.builder()
      .issuer(authProperties.issuerUri)
      .build()
  }

  @Bean
  fun registeredClientRepository(): RegisteredClientRepository {
    return clientService.createRegisteredClientRepository()
  }
}
