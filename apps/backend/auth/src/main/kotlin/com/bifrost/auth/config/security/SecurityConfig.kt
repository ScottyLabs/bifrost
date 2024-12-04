package com.bifrost.auth.config.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer
import org.springframework.security.provisioning.JdbcUserDetailsManager
import org.springframework.security.provisioning.UserDetailsManager
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint
import org.springframework.web.cors.CorsConfigurationSource
import javax.sql.DataSource

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
      .oidc(withDefaults())

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
            "/register",
            "/css/**",
            "/images/**",
            "/error",
            "/.well-known/openid-configuration",
            "/oauth2/authorize",
            "/oauth2/jwks",
            "/oauth2/token",
            "/favicon.ico"
          ).permitAll()
          .anyRequest().authenticated()
      }
      .formLogin { form ->
        form
          .loginPage("/login")
          .permitAll()
      }
      .logout { logout ->
        logout.permitAll()
      }
      .cors { cors ->
        cors.configurationSource(corsConfigurationSource)
      }
      .csrf { csrf ->
        csrf.ignoringRequestMatchers(
          "/oauth2/token",
          "/login",
          "/register"
        )
      }

    return http.build()
  }

  @Bean
  fun userDetailsManager(dataSource: DataSource): UserDetailsManager {
    // This will automatically create the default Spring Security user tables if they don't exist
    val manager = JdbcUserDetailsManager(dataSource)
    manager.usersByUsernameQuery = "select username, password, enabled from users where username = ?"
    manager.setAuthoritiesByUsernameQuery("select username, authority from authorities where username = ?")
    return manager
  }

  @Bean
  fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}
