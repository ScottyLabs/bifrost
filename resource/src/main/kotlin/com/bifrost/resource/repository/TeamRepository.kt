package com.bifrost.resource.repository

import com.bifrost.resource.model.Team
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface TeamRepository : JpaRepository<Team, UUID> {
  fun existsByName(name: String): Boolean
}
