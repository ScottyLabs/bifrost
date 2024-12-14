package com.bifrost.resource.security.authority

enum class Role(val value: String) {
  USER("ROLE_USER"),
  MENTOR("ROLE_MENTOR"),
  JUDGE("ROLE_JUDGE"),
  ORGANIZER("ROLE_ORGANIZER"),
  ADMIN("ROLE_ADMIN");

  // Define authorities for each role
  val authorities: Set<String>
    get() = when (this) {
      USER -> setOf(
        ApplicationAuthority.READ,
        ApplicationAuthority.CREATE,
        ApplicationAuthority.UPDATE,
        ApplicationAuthority.SUBMIT,
        TeamAuthority.READ
      )

      MENTOR -> setOf(
        TeamAuthority.READ,
        TeamAuthority.MANAGE_MEMBERS,
        UserAuthority.READ
      )

      JUDGE -> setOf(
        ApplicationAuthority.READ,
        ApplicationAuthority.REVIEW,
        TeamAuthority.READ
      )

      ORGANIZER -> setOf(
        ApplicationAuthority.READ,
        ApplicationAuthority.REVIEW,
        UserAuthority.READ,
        UserAuthority.UPDATE,
        TeamAuthority.READ,
        TeamAuthority.MANAGE_MEMBERS
      )

      ADMIN -> ApplicationAuthority::class.java.declaredFields.map { it.get(null) as String }.toSet() +
        TeamAuthority::class.java.declaredFields.map { it.get(null) as String }.toSet() +
        UserAuthority::class.java.declaredFields.map { it.get(null) as String }.toSet()
    }
}
