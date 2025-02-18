package com.bifrost.resource.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "events")
class Event(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @Column(nullable = false)
  var name: String,

  var website: String? = null,

  var logo: String? = null,

  @Column(nullable = false)
  var startDate: Date,

  @Column(nullable = false)
  var endDate: Date
)
