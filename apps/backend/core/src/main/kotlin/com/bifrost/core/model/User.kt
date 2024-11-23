package com.bifrost.core.model

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import java.util.*

@Entity
@Table(name = "users")
class User(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @field:NotBlank
  val username: String,

  @field:Email
  @field:NotBlank
  @Column(nullable = false, unique = true)
  var email: String,

  @Column(nullable = false)
  var name: String,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "team_id")
  var team: Team? = null,

  @Column(nullable = false)
  var college: String,

  @Enumerated(EnumType.STRING)
  var status: Status = Status.UNVERIFIED,

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_roles", joinColumns = [JoinColumn(name = "user_id")])
  @Column(name = "role")
  var roles: MutableSet<String> = mutableSetOf(),

  @OneToMany(mappedBy = "user")
  var checkins: MutableSet<UserCheckin> = mutableSetOf()
)
