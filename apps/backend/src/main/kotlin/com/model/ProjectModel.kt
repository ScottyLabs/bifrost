package com
import org.springframework.data.annotation.Id
import java.util.UUID
import jakarta.persistence.Table

@Table()
data class Project(
  var name: String,
  var description: String,
  var url: String,
  var location: String,
  var slides: String,
  var Video: String,
  var teamID: UUID,
  var prizeID: UUID,
  var trackID: UUID
)
