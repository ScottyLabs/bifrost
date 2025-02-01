package com.bifrost.resource.interceptor

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor

@Component
class LoggingInterceptor : HandlerInterceptor {
  private val logger = LoggerFactory.getLogger(LoggingInterceptor::class.java)

  override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
    logger.info("${request.method} ${request.requestURI} - Started")
    return true
  }

  override fun afterCompletion(
    request: HttpServletRequest,
    response: HttpServletResponse,
    handler: Any,
    ex: Exception?
  ) {
    val status = response.status
    logger.info("${request.method} ${request.requestURI} - Completed with status $status")
    if (ex != null) {
      logger.error("Request failed", ex)
    }
  }
}
