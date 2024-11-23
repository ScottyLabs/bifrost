package com.bifrost.resource.security

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*

class AuthenticatedUser(
  override val id: UUID,
  private val username: String,
  private val password: String,
  private val authorities: Collection<GrantedAuthority>
) : UserDetails, UserPrincipal {

  override fun getAuthorities() = authorities
  override fun getPassword() = password
  override fun getUsername() = username
  override fun isAccountNonExpired() = true
  override fun isAccountNonLocked() = true
  override fun isCredentialsNonExpired() = true
  override fun isEnabled() = true
}
