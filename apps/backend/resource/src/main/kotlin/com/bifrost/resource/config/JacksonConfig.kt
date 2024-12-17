package com.bifrost.resource.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.json.JsonMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JacksonConfig {
  @Bean
  fun jsonMapper(): ObjectMapper {
    return JsonMapper.builder()
      .findAndAddModules()
      .build()
  }
}
