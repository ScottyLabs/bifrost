package com.bifrost.resource.security

import com.scottylabs.resource.security.UserPrincipal
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import java.util.*
import kotlin.collections.any

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
