package com.bifrost.auth.config.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint
import org.springframework.web.cors.CorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
  private val corsConfigurationSource: CorsConfigurationSource
) {

  @Bean
  @Order(1)
  fun authorizationServerSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
    OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http)

    http.getConfigurer(OAuth2AuthorizationServerConfigurer::class.java)
      .oidc(withDefaults())    // Enable OIDC

    http
      .cors(withDefaults())
      .exceptionHandling { e ->
        e.authenticationEntryPoint(
          LoginUrlAuthenticationEntryPoint("/login")
        )
      }
      .oauth2ResourceServer { it.jwt(withDefaults()) }

    return http.build()
  }

  @Bean
  @Order(2)
  fun defaultSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
    http
      .authorizeHttpRequests { authorize ->
        authorize
          .requestMatchers(
            "/login",
            "/.well-known/openid-configuration",
            "/oauth2/jwks",
            "/oauth2/token"
          ).permitAll()
          .anyRequest().authenticated()
      }
      .formLogin(withDefaults())

    return http.build()
  }

  // For demo purposes - in production you'd want a real user database
  @Bean
  fun userDetailsService(): UserDetailsService {
    val userBuilder = User.builder()
      .passwordEncoder { password -> passwordEncoder().encode(password) }

    val defaultUser = userBuilder
      .username("user")
      .password("password")
      .roles("USER")
      .build()

    val admin = userBuilder
      .username("admin")
      .password("admin")
      .roles("USER", "ADMIN")
      .build()

    return InMemoryUserDetailsManager(defaultUser, admin)
  }

  @Bean
  fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}
