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
  fun findById(id: UUID): User? = userRepository.findById(id).orElse(null)
  
  fun findByExternalId(externalId: String): User? = userRepository.findByExternalId(externalId)

  @Transactional
  fun create(user: User): User = userRepository.save(user)

  @Transactional
  fun update(user: User): User = userRepository.save(user)

  @Transactional
  fun delete(id: UUID) = userRepository.deleteById(id)
}
