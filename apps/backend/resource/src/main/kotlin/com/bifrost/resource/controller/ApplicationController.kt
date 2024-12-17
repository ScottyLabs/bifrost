package com.bifrost.resource.controller

import com.bifrost.resource.model.*
import com.bifrost.resource.service.ApplicationService
import com.bifrost.resource.service.UserService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Application management endpoints")
class ApplicationController(
  private val applicationService: ApplicationService,
  private val userService: UserService
) {
  @GetMapping
  @Operation(summary = "Get user's application")
  @ApiResponse(responseCode = "200", description = "Application found")
  @ApiResponse(responseCode = "404", description = "No application found for user")
  fun getApplication(authentication: JwtAuthenticationToken): Application {
    val subject = authentication.token.subject
    val user = userService.getUserByExternalId(subject)
    return applicationService.getApplicationByUserId(user.id)
      ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found")
  }

  @PostMapping
  @Operation(summary = "Create new application")
  @ApiResponse(responseCode = "201", description = "Application created successfully")
  @ApiResponse(responseCode = "409", description = "Application already exists")
  fun createApplication(
    authentication: JwtAuthenticationToken,
    @Valid @RequestBody request: ApplicationRequest
  ): Application {
    val subject = authentication.token.subject
    val user = userService.getUserByExternalId(subject)
    return applicationService.createApplication(user.id, request)
      ?: throw ResponseStatusException(HttpStatus.CONFLICT, "Application already exists")
  }

  @PutMapping
  @Operation(summary = "Update draft application")
  @ApiResponse(responseCode = "200", description = "Application updated successfully")
  @ApiResponse(responseCode = "404", description = "Application not found")
  @ApiResponse(responseCode = "409", description = "Application is not in DRAFT status")
  fun updateApplication(
    authentication: JwtAuthenticationToken,
    @Valid @RequestBody request: ApplicationRequest
  ): Application {
    val subject = authentication.token.subject
    val user = userService.getUserByExternalId(subject)
    return applicationService.updateApplication(user.id, request)
      ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found or not in DRAFT status")
  }

  @PostMapping("/submit")
  @Operation(summary = "Submit application")
  @ApiResponse(responseCode = "200", description = "Application submitted successfully")
  @ApiResponse(responseCode = "404", description = "Application not found")
  @ApiResponse(responseCode = "409", description = "Application is not in DRAFT status")
  @ApiResponse(responseCode = "400", description = "Application missing required acknowledgements")
  fun submitApplication(authentication: JwtAuthenticationToken): Application {
    val subject = authentication.token.subject
    val user = userService.getUserByExternalId(subject)
    return applicationService.submitApplication(user.id)
      ?: throw ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Application not found, not in DRAFT status, or missing required acknowledgements"
      )
  }
}

data class ApplicationRequest(
  val name: String,
  val email: String,
  val phone: String,
  val school: String,
  val grade: Grade,
  val age: Int,
  val gender: Gender,
  val ethnicity: Ethnicity,
  val city: String,
  val major: String,
  val relevantCoursework: List<String>,
  val programmingLanguages: List<String>,
  val previousProgrammingExperience: Boolean,
  val essayQuestion1: String,
  val githubUrl: String,
  val linkedinUrl: String,
  val resumeUrl: String,
  val designPortfolioUrl: String?,
  val dietaryRestrictions: String?,
  val tshirtSize: TShirtSize,
  val accessibilityNeeds: String?,
  val travelReimbursementAcknowledgement: Boolean,
  val travelReimbursementDetails: String?,
  val codeOfConductAcknowledgement: Boolean,
  val privacyPolicyAcknowledgement: Boolean,
  val termsAndConditionsAcknowledgement: Boolean,
  val photoReleaseAcknowledgement: Boolean
)

