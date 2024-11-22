package com.scottylabs.resource.service

import com.scottylabs.resource.domain.model.User
import com.scottylabs.resource.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class UserService(
  private val userRepository: UserRepository
) {
  fun findById(id: UUID): User? = userRepository.findById(id).orElse(null)

  fun findByEmail(email: String): User? = userRepository.findByEmail(email)

  @Transactional
  fun create(user: User): User = userRepository.save(user)

  @Transactional
  fun update(user: User): User = userRepository.save(user)

  fun delete(id: UUID) = userRepository.deleteById(id)
}
