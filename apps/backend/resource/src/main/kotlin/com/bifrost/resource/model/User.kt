package com.bifrost.resource.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.util.*

@Entity
@Table(name = "users")
data class User(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, updatable = false)
  val id: UUID = UUID.randomUUID(),

  @Column(name = "external_id", nullable = false, unique = true)
  val externalId: String,

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  var status: UserStatus = UserStatus.UNVERIFIED,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "team_id")
  var team: Team? = null,

  @ElementCollection(fetch = FetchType.EAGER, targetClass = AccessLevel::class)
  @CollectionTable(
    name = "user_access_levels",
    joinColumns = [JoinColumn(name = "user_id")]
  )
  @Column(name = "access_level")
  @Enumerated(EnumType.STRING)
  var accessLevels: MutableSet<AccessLevel> = mutableSetOf(),

  @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
  var application: Application? = null,

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  var createdAt: Date = Date(),

  @UpdateTimestamp
  @Column(nullable = false)
  var updatedAt: Date = Date()
)

enum class UserStatus {
  UNVERIFIED,
  ACTIVE,
  SUSPENDED,
  BANNED,
  DELETED
}
