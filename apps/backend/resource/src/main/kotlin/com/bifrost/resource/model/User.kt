package com.bifrost.resource.model

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.util.*

@Entity
@Table(name = "users")
data class User(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(nullable = false, updatable = false)
  val id: UUID,

  @field:NotBlank
  @Column(nullable = false, unique = true)
  val username: String,

  @field:Email
  @field:NotBlank
  @Column(nullable = false, unique = true)
  val email: String,

  @field:NotBlank
  @Column(nullable = false)
  val name: String,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "team_id")
  var team: Team? = null, // Nullable, as users may not always have a team

  @field:NotBlank
  @Column(nullable = false)
  val college: String,

  @field:NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  var status: Status = Status.UNVERIFIED,

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_roles", joinColumns = [JoinColumn(name = "user_id")])
  @Column(name = "role", nullable = false)
  var roles: MutableSet<String> = mutableSetOf(),

  @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
  @field:NotNull
  var checkins: MutableSet<UserCheckin> = mutableSetOf()
)
