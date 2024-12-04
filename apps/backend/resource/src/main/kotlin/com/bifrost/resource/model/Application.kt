package com.bifrost.resource.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "applications")
data class Application(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID,

  @OneToOne
  @JoinColumn(name = "user_id", nullable = false)
  var user: User,

  @Column(nullable = false)
  var essayQuestion1: String,

  @Column(nullable = false)
  var essayQuestion2: String,

  @Column(nullable = true)
  var github: String?,

  @Column(nullable = true)
  var designPortfolio: String?,

  @Column(nullable = true)
  var resumeFilePath: String?
)
