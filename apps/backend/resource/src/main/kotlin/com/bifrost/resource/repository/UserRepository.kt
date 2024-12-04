package com.bifrost.resource.repository


import com.bifrost.resource.model.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {
  fun findByEmail(email: String): User?
  fun findByUsername(username: String): User?
}
