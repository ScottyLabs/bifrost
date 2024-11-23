package com.scottylabs.resource.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class ResourceServerConfig {

  @Bean
  fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
    http
      .cors(withDefaults())
      .csrf { it.disable() }
      .authorizeHttpRequests { auth ->
        auth
          .requestMatchers("/api/public/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
          .anyRequest().authenticated()
      }
      .oauth2ResourceServer { oauth2 ->
        oauth2.jwt { jwt ->
          jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
        }
      }

    return http.build()
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
