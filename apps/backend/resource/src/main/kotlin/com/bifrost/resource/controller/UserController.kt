package com.bifrost.resource.controller

import com.bifrost.resource.model.User
import com.bifrost.resource.service.UserService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users")
class UserController(
  private val userService: UserService
) {
  @GetMapping("/{id}")
  fun getUser(@PathVariable id: UUID): User {
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
}
