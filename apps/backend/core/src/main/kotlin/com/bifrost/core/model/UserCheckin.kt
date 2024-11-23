package com.bifrost.core.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "user_checkins")
class UserCheckin(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  var user: User,

  @ManyToOne
  @JoinColumn(name = "checkin_id", nullable = false)
  var checkin: Checkin,

  @Column(nullable = false)
  var timestamp: LocalDateTime = LocalDateTime.now()
)
