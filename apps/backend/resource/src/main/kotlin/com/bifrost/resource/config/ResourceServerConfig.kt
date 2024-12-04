package com.bifrost.resource.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class ResourceServerConfig {

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
            "/v3/api-docs**", // .yaml
            "/swagger-ui**", // .html
          ).permitAll()
          .requestMatchers("/api/public/**").permitAll() // Allow public endpoints
          .anyRequest().authenticated()
      }
      .oauth2ResourceServer { oauth2 ->
        oauth2.jwt { jwt ->
          jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
        }
      }
      .build()
  }

  @Bean
  fun corsConfigurationSource(): CorsConfigurationSource {
    val configuration = CorsConfiguration()
    configuration.allowedOrigins = listOf("http://localhost:3000") // Allow localhost:3000
    configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
    configuration.allowedHeaders = listOf("*") // Allow all headers
    configuration.allowCredentials = true // Allow credentials like cookies, Authorization headers

    val source = UrlBasedCorsConfigurationSource()
    source.registerCorsConfiguration("/**", configuration)
    return source
  }

  @Bean
  fun jwtDecoder(): JwtDecoder {
    return JwtDecoders.fromIssuerLocation("http://localhost:9000")
  }

  @Bean
  fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
    val jwtGrantedAuthoritiesConverter = JwtGrantedAuthoritiesConverter()
    jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("roles")
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_")

    val jwtAuthenticationConverter = JwtAuthenticationConverter()
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter)
    return jwtAuthenticationConverter
  }
}
