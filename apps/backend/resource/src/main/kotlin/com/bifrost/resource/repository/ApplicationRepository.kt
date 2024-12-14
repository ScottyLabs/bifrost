package com.bifrost.resource.repository

import com.bifrost.resource.model.Application
import com.bifrost.resource.model.ApplicationStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ApplicationRepository : JpaRepository<Application, UUID> {
  fun findByUserId(userId: UUID): Application?
  fun findByStatus(status: ApplicationStatus): List<Application>
  fun findByEmail(email: String): Application?
  fun existsByEmail(email: String): Boolean
}
