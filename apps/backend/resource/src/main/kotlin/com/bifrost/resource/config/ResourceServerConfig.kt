package com.bifrost.resource.config

import com.bifrost.resource.security.authority.Role
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinFeature
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.firewall.HttpFirewall
import org.springframework.security.web.firewall.StrictHttpFirewall
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class ResourceServerConfig {
  @Value("\${spring.security.oauth2.resourceserver.jwt.allowed-origins}")
  private lateinit var allowedOrigins: String

  @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
  private lateinit var issuerUri: String

  @Value("\${spring.security.oauth2.resourceserver.jwt.jwks-uri}")
  private lateinit var jwksUri: String

  @Bean
  fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
    return http
      .cors(withDefaults())
      .csrf { it.disable() }
      .sessionManagement {
        it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      }
      .authorizeHttpRequests { auth ->
        auth
          .requestMatchers(
            "/actuator/health/**",
            "/actuator/info/**",
            "/actuator/metrics/**",
            "/actuator/prometheus/**"
          ).permitAll()
          .requestMatchers(
            "/v3/api-docs/**", // .yaml
            "/swagger-ui.html**", // .html
            "/swagger-ui/**", // .html
            "/api/public/**", // Public API
            "/webhook/**" // Webhook endpoints
          ).permitAll()
          .anyRequest().authenticated()
      }
      .oauth2ResourceServer { oauth2 ->
        oauth2.jwt(withDefaults())
      }
      .build()
  }

  @Bean
  fun corsConfigurationSource(): CorsConfigurationSource {
    val configuration = CorsConfiguration()

    configuration.allowedOrigins = allowedOrigins.split(',').map { it.trim() }
    configuration.allowedMethods = listOf("*") // Allow all HTTP methods
    configuration.allowedHeaders = listOf("*") // Allow all headers
    configuration.allowCredentials = true // Allow credentials like cookies, Authorization headers

    val source = UrlBasedCorsConfigurationSource()
    source.registerCorsConfiguration("/**", configuration)
    return source
  }

  @Bean
  fun jwtDecoder(): JwtDecoder {
    return JwtDecoders.fromIssuerLocation(issuerUri)
  }

  @Bean
  fun allowUrlEncodedSlashHttpFirewall(): HttpFirewall {
    val firewall = StrictHttpFirewall()
    firewall.setAllowUrlEncodedSlash(true)
    firewall.setAllowUrlEncodedPeriod(true)
    return firewall
  }

  @Bean
  fun objectMapper(): ObjectMapper {
    return ObjectMapper().registerModule(
      KotlinModule.Builder()
        .withReflectionCacheSize(512)
        .configure(KotlinFeature.NullToEmptyCollection, false)
        .configure(KotlinFeature.NullToEmptyMap, false)
        .configure(KotlinFeature.NullIsSameAsDefault, false)
        .configure(KotlinFeature.SingletonSupport, false)
        .configure(KotlinFeature.StrictNullChecks, false)
        .build()
    )
  }

  @Bean
  fun jwtAuthenticationConverter(): Converter<Jwt, AbstractAuthenticationToken> {
    val grantedAuthoritiesConverter = JwtGrantedAuthoritiesConverter().apply {
      setAuthoritiesClaimName("permissions")
      setAuthorityPrefix("")
    }

    return JwtAuthenticationConverter().apply {
      setJwtGrantedAuthoritiesConverter { jwt ->
        val authorities = grantedAuthoritiesConverter.convert(jwt)?.toMutableList()
          ?: mutableListOf()

        jwt.getClaimAsString("role")?.let { roleString ->
          Role.entries.find { it.value == "ROLE_$roleString" }?.let { role ->
            authorities.add(SimpleGrantedAuthority(role.value))
            role.authorities.forEach {
              authorities.add(SimpleGrantedAuthority(it))
            }
          }
        }

        authorities
      }
    }
  }
}
