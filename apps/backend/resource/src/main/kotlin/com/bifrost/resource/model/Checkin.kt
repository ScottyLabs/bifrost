package com.bifrost.resource.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.util.*

@Entity
@Table(name = "checkins")
data class Checkin(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @ManyToOne
  @JoinColumn(name = "event_id", nullable = false)
  var event: Event,

  @Column(nullable = false)
  var name: String,

  @Column(nullable = false)
  var description: String,

  @Column(nullable = false)
  var startTime: Long,

  @Column(nullable = false)
  var endTime: Long,

  @Column(nullable = false)
  var points: Int,

  @Enumerated(EnumType.STRING)
  var accessLevel: AccessLevel,

  @Column(nullable = false)
  var active: Boolean = true,

  @Column(nullable = false)
  var enableSelfCheckin: Boolean = false,

  @CreationTimestamp
  @Column(nullable = false)
  var createdAt: Date = Date()
)
