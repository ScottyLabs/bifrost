package com.scottylabs.resource.security

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import java.util.*

@Component
class SecurityUtils {

  fun hasRole(role: String): Boolean =
    SecurityContextHolder.getContext().authentication
      .authorities.any { it.authority == role }

  fun isResourceOwner(resourceId: UUID): Boolean {
    return when (val principal = SecurityContextHolder.getContext().authentication.principal) {
      is UserPrincipal -> principal.id == resourceId
      else -> false
    }
  }
}
