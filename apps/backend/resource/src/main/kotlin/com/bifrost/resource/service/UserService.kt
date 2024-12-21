package com.bifrost.resource.service

import com.bifrost.resource.model.User
import com.bifrost.resource.model.UserStatus
import com.bifrost.resource.repository.TeamRepository
import com.bifrost.resource.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class UserService(
  private val userRepository: UserRepository,
  private val teamRepository: TeamRepository
) {
  fun getUser(id: UUID): User {
    return userRepository.findById(id)
      .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: $id") }
  }

  fun getUserByExternalId(externalId: String): User {
    println("Getting user by external ID: $externalId")
    return userRepository.findByExternalId(externalId)
      ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
  }

  @Transactional
  fun createUser(user: User): User {
    println("Creating user: $user")
    if (userRepository.existsByExternalId(user.externalId)) {
      throw ResponseStatusException(HttpStatus.CONFLICT, "External ID already exists")
    }
    println("Creating user: $user")
    return userRepository.save(user)
  }

  @Transactional
  fun updateUser(id: UUID, updatedUser: User): User {
    val user = getUser(id)

    user.team = updatedUser.team?.let { teamId ->
      teamRepository.findById(teamId.id)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found") }
    }
    user.accessLevels = updatedUser.accessLevels

    return userRepository.save(user)
  }

  fun deleteUser(id: UUID) {
    val user = getUser(id)
    user.status = UserStatus.DELETED
    userRepository.save(user)
  }
}
