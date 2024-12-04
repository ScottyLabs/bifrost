package com.bifrost.resource.service

import com.bifrost.resource.model.User
import com.bifrost.resource.repository.UserRepository
import jakarta.transaction.Transactional

import org.springframework.stereotype.Service

import java.util.*

@Service
class UserService(
  private val userRepository: UserRepository
) {
  fun findById(id: UUID): User = userRepository.findById(id).orElse(null)

  fun findByUsername(username: String): User? = userRepository.findByUsername(username)

  fun findByEmail(email: String): User? = userRepository.findByEmail(email)

  @Transactional
  fun create(user: User): User = userRepository.save(user)

  @Transactional
  fun update(user: User): User = userRepository.save(user)

  fun delete(id: UUID) = userRepository.deleteById(id)
}
