package com.bifrost.resource.repository

import com.bifrost.resource.model.Application
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ApplicationRepository : JpaRepository<Application, Long> {
  fun findByUserId(userId: UUID): Application?
}
