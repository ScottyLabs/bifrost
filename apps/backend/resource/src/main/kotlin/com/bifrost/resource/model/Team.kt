package com.bifrost.resource.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.util.*

@Entity
@Table(
  name = "teams",
  indexes = [
    Index(name = "idx_team_name", columnList = "name", unique = true)
  ]
)
data class Team(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false, updatable = false)
  val id: UUID = UUID.randomUUID(),

  @Column(name = "name", nullable = false, unique = true)
  var name: String,

  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  var description: String,

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "leader_id", nullable = false)
  var leader: User,

  @OneToMany(mappedBy = "team", fetch = FetchType.LAZY)
  var members: Set<User> = setOf(),

  @Column(name = "is_open", nullable = false)
  var isOpen: Boolean = true,

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  var status: TeamStatus = TeamStatus.ACTIVE,


  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  var createdAt: Date = Date(),

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  var updatedAt: Date = Date()
)

enum class TeamStatus {
  ACTIVE,
  LOCKED,
  ARCHIVED
}
