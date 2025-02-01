package com.bifrost.resource.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "prizes")
data class Prize(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @Column(nullable = false)
  var name: String,

  @Column(nullable = false)
  var description: String,

  @Column(nullable = false)
  var provider: String,

  @Column(nullable = false)
  var value: String,

  @OneToMany(mappedBy = "prize")
  var projects: MutableList<Project> = mutableListOf()
)
