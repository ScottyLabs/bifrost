package com.bifrost.resource.service

import com.bifrost.resource.model.Team
import com.bifrost.resource.repository.TeamRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class TeamService(
  private val teamRepository: TeamRepository,
  private val userService: UserService
) {
  fun getTeam(id: UUID): Team {
    return teamRepository.findById(id)
      .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found") }
  }

  @Transactional
  fun createTeam(name: String, description: String, leaderId: UUID): Team {
    if (teamRepository.existsByName(name)) {
      throw ResponseStatusException(HttpStatus.CONFLICT, "Team name already exists")
    }

    val leader = userService.getUser(leaderId)
    if (leader.team != null) {
      throw ResponseStatusException(HttpStatus.CONFLICT, "Leader is already in a team")
    }

    val team = Team(
      name = name,
      description = description,
      leader = leader
    )

    val savedTeam = teamRepository.save(team)
    leader.team = savedTeam
    return savedTeam
  }

  @Transactional
  fun updateTeam(id: UUID, name: String?, description: String?, isOpen: Boolean?): Team {
    val team = getTeam(id)

    name?.let {
      if (it != team.name && teamRepository.existsByName(it)) {
        throw ResponseStatusException(HttpStatus.CONFLICT, "Team name already exists")
      }
      team.name = it
    }

    description?.let { team.description = it }
    isOpen?.let { team.isOpen = it }

    return teamRepository.save(team)
  }

  @Transactional
  fun addMember(teamId: UUID, userId: UUID): Team {
    val team = getTeam(teamId)
    val user = userService.getUser(userId)

    if (!team.isOpen) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Team is not open for new members")
    }

    if (user.team != null) {
      throw ResponseStatusException(HttpStatus.CONFLICT, "User is already in a team")
    }

    user.team = team
    return team
  }

  @Transactional
  fun removeMember(teamId: UUID, userId: UUID): Team {
    val team = getTeam(teamId)
    val user = userService.getUser(userId)

    if (user.team?.id != teamId) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not in this team")
    }

    if (team.leader.id == userId) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot remove team leader")
    }

    user.team = null
    return team
  }

  @Transactional
  fun changeLeader(teamId: UUID, newLeaderId: UUID): Team {
    val team = getTeam(teamId)
    val newLeader = userService.getUser(newLeaderId)

    if (newLeader.team?.id != teamId) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST, "New leader must be a team member")
    }

    team.leader = newLeader
    return teamRepository.save(team)
  }
}
