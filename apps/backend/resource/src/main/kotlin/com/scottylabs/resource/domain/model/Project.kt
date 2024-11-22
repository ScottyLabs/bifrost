package com.scottylabs.resource.domain.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "projects")
class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var description: String,

    var url: String? = null,

    var location: String? = null,

    var slides: String? = null,

    var video: String? = null,

    @ManyToOne
    @JoinColumn(name = "team_id")
    var team: Team? = null,

    @ManyToOne
    @JoinColumn(name = "prize_id")
    var prize: Prize? = null,

    @ManyToOne
    @JoinColumn(name = "track_id")
    var track: Track? = null
)
