package com.bifrost.core.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "prizes")
class Prize(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @Column(nullable = false)
  var name: String,

  @Column(nullable = false)
  var description: String,

  @Column(nullable = false)
  var provider: String,  // Company/Organization providing the prize

  @Column(nullable = false)
  var value: String,    // Could be monetary amount or description of prize

  @OneToMany(mappedBy = "prize")
  var projects: MutableList<Project> = mutableListOf()
)
