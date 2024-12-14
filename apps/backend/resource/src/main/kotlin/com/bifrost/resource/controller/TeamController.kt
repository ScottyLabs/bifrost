package com.bifrost.resource.controller

import com.bifrost.resource.model.Team
import com.bifrost.resource.service.TeamService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/teams")
@Tag(name = "Teams")
class TeamController(
  private val teamService: TeamService
) {
  @GetMapping("/{id}")
  fun getTeam(@PathVariable id: UUID): Team {
    return teamService.getTeam(id)
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  fun createTeam(
    @RequestBody request: CreateTeamRequest
  ): Team {
    return teamService.createTeam(
      name = request.name,
      description = request.description,
      leaderId = request.leaderId
    )
  }

  @PutMapping("/{id}")
  fun updateTeam(
    @PathVariable id: UUID,
    @RequestBody request: UpdateTeamRequest
  ): Team {
    return teamService.updateTeam(
      id = id,
      name = request.name,
      description = request.description,
      isOpen = request.isOpen
    )
  }

  @PostMapping("/{id}/members/{userId}")
  fun addMember(
    @PathVariable id: UUID,
    @PathVariable userId: UUID
  ): Team {
    return teamService.addMember(id, userId)
  }

  @DeleteMapping("/{id}/members/{userId}")
  fun removeMember(
    @PathVariable id: UUID,
    @PathVariable userId: UUID
  ): Team {
    return teamService.removeMember(id, userId)
  }

  @PutMapping("/{id}/leader/{userId}")
  fun changeLeader(
    @PathVariable id: UUID,
    @PathVariable userId: UUID
  ): Team {
    return teamService.changeLeader(id, userId)
  }
}

data class CreateTeamRequest(
  val name: String,
  val description: String,
  val leaderId: UUID
)

data class UpdateTeamRequest(
  val name: String?,
  val description: String?,
  val isOpen: Boolean?
)

