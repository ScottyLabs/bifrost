package com.bifrost.resource.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest


@RestControllerAdvice
class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException::class)
  fun handleResourceNotFoundException(
    ex: ResourceNotFoundException,
    request: WebRequest
  ): ResponseEntity<ErrorResponse> {
    val errorResponse = ErrorResponse(
      status = HttpStatus.NOT_FOUND.value(),
      error = "Not Found",
      message = ex.message ?: "Resource not found",
      path = request.getDescription(false).substring(4)
    )
    return ResponseEntity(errorResponse, HttpStatus.NOT_FOUND)
  }

  // Handle 401 Unauthorized
  @ExceptionHandler(value = [UnauthorizedException::class])
  fun handleUnauthorizedException(ex: UnauthorizedException, request: WebRequest?): ResponseEntity<Any> {
    val response: MutableMap<String, String> = HashMap()
    response["error"] = "unauthorized"
    response["message"] = ex.message ?: "Unauthorized"
    return ResponseEntity(response, HttpStatus.UNAUTHORIZED)
  }

  // Handle other exceptions (optional)
  @ExceptionHandler(value = [Exception::class])
  fun handleGlobalException(ex: Exception?, request: WebRequest?): ResponseEntity<Any> {
    val response: MutableMap<String, String> = HashMap()
    response["error"] = "internal_error"
    response["message"] = "An unexpected error occurred."
    return ResponseEntity(response, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

data class ErrorResponse(
  val status: Int,
  val error: String,
  val message: String,
  val path: String,
  val timestamp: Long = System.currentTimeMillis()
)
