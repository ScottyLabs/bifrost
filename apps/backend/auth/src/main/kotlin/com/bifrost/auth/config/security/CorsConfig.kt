package com.scottylabs.auth.config.security

import com.scottylabs.auth.config.properties.AuthProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class CorsConfig(private val authProperties: AuthProperties) {

  @Bean
  fun corsConfigurationSource(): CorsConfigurationSource {
    val configuration = CorsConfiguration().apply {
      // Allow the specified origins from properties
      allowedOrigins = authProperties.corsAllowedOrigins

      // Standard methods needed for OIDC/OAuth2
      allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")

      // Allow common headers
      allowedHeaders = listOf(
        "Authorization",
        "Content-Type",
        "Accept",
        "X-Requested-With",
        "remember-me",
        "Origin"
      )

      // Allow credentials (cookies, authorization headers)
      allowCredentials = true

      // How long the browser should cache the CORS response
      maxAge = 3600L
    }

    return UrlBasedCorsConfigurationSource().apply {
      registerCorsConfiguration("/**", configuration)
    }
  }
}
