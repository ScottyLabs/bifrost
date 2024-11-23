package com.bifrost.core.exception

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

  // Add other exception handlers as needed
}

data class ErrorResponse(
  val status: Int,
  val error: String,
  val message: String,
  val path: String,
  val timestamp: Long = System.currentTimeMillis()
)
