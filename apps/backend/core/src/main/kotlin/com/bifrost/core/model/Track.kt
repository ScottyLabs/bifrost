package com.bifrost.core.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "tracks")
class Track(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @Column(nullable = false)
  var name: String,      // e.g., "Fintech", "Healthcare", "Education"

  @Column(nullable = false)
  var description: String,

  @OneToMany(mappedBy = "track")
  var projects: MutableList<Project> = mutableListOf()
)
