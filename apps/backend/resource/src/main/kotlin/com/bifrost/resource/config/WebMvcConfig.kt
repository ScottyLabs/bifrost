package com.bifrost.resource.config

import com.bifrost.resource.interceptor.LoggingInterceptor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebMvcConfig : WebMvcConfigurer {
  @Autowired
  private lateinit var loggingInterceptor: LoggingInterceptor

  override fun addInterceptors(registry: InterceptorRegistry) {
    registry.addInterceptor(loggingInterceptor)
      .addPathPatterns("/api/**") // Only log API routes
  }
}
