package com.bifrost.resource.controller

import com.bifrost.resource.model.User
import com.bifrost.resource.service.UserService
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/users")
@Validated
@Tag(name = "Users")
class UserController(
  private val userService: UserService,
//  private val securityUtils: SecurityUtils  // Inject security utilities
) {

  companion object {
    const val ADMIN_ROLE = "ROLE_ADMIN"
    private const val SELF_OR_ADMIN_AUTH = """
            @securityUtils.hasRole('$ADMIN_ROLE') or
            @securityUtils.isResourceOwner(#id)
        """
  }

  @GetMapping("/{id}")
  @PreAuthorize(SELF_OR_ADMIN_AUTH)
  fun getUser(@PathVariable id: UUID): ResponseEntity<User> =
    userService.findById(id).let { ResponseEntity.ok(it) }

  @PostMapping
  @PreAuthorize("@securityUtils.hasRole('$ADMIN_ROLE')")
  @ResponseStatus(HttpStatus.CREATED)
  fun createUser(@Valid @RequestBody user: User): User =
    userService.create(user)

  @PutMapping("/{id}")
  @PreAuthorize(SELF_OR_ADMIN_AUTH)
  fun updateUser(
    @PathVariable id: UUID,
    @Valid @RequestBody user: User
  ): ResponseEntity<User> {
    if (id != user.id) {
      return ResponseEntity.badRequest().build()
    }

    return userService.findById(id).let {
      ResponseEntity.ok(userService.update(user))
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize(SELF_OR_ADMIN_AUTH)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  fun deleteUser(@PathVariable id: UUID) {
    userService.findById(id).let {
      userService.delete(id)
    }
  }

  @GetMapping("/me")
  fun getCurrentUser(): ResponseEntity<User> {
    val authentication = SecurityContextHolder.getContext().authentication
    val username = when (val principal = authentication.principal) {
      is UserDetails -> principal.username
      is String -> principal // In case the principal is just a username
      else -> throw IllegalStateException("Invalid authentication principal")
    }

    val user = userService.findByUsername(username)
    return ResponseEntity.ok(user)
  }
}
