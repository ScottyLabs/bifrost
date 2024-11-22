package com.scottylabs.resource.domain.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "teams")
class Team(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @Column(nullable = false)
  var name: String,

  @Column(nullable = false)
  var description: String,

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "leader_id", nullable = false)
  var leader: User,

  @OneToMany(mappedBy = "team")
  var members: MutableList<User> = mutableListOf(),

  @Column(nullable = false)
  var open: Boolean = true
)
