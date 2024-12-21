package com.bifrost.resource.controller

import com.bifrost.resource.model.User
import com.bifrost.resource.service.UserService
import io.swagger.v3.oas.annotations.tags.Tag
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users")
class UserController(
  private val userService: UserService
) {
  private val logger = LoggerFactory.getLogger(WebhookController::class.java)

  @GetMapping("/me")
  fun getCurrentUser(
    authentication: JwtAuthenticationToken
  ): User {
    val externalId = authentication.token.subject
    println("Getting current user")
    return userService.getUserByExternalId(externalId)
  }

  @GetMapping("/{id}")
  fun getUser(@PathVariable id: UUID): User {
    logger.info("Getting user by ID: $id")
    return userService.getUser(id)
  }

  @GetMapping("/external/{externalId}")
  fun getUserByExternalId(@PathVariable externalId: String): User {
    return userService.getUserByExternalId(externalId)
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  fun createUser(@RequestBody user: User): User {
    return userService.createUser(user)
  }

  @PutMapping("/{id}")
  fun updateUser(
    @PathVariable id: UUID,
    @RequestBody user: User
  ): User {
    return userService.updateUser(id, user)
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  fun deleteUser(@PathVariable id: UUID) {
    userService.deleteUser(id)
  }

  private fun getUserIdFromToken(authentication: JwtAuthenticationToken): String {
    return try {
      authentication.token.claims["sub"] as String
    } catch (e: Exception) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID in token")
    }
  }
}
