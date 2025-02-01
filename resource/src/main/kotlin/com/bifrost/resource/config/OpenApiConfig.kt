package com.bifrost.resource.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

  @Bean
  fun openAPI(): OpenAPI = OpenAPI()
    .info(
      Info()
        .title("Bifrost API")
        .description("API documentation for Bifrost")
        .version("1.0.0")
    )
}
