package com.bifrost.resource.controller

import com.bifrost.resource.model.*
import com.bifrost.resource.service.ApplicationService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Application management endpoints")
class ApplicationController(
  private val applicationService: ApplicationService
) {
  @PreAuthorize("hasAuthority('APPLICATION_READ') or #userId == authentication.principal.id")
  @GetMapping
  @Operation(summary = "Get user's application", description = "Retrieves the current user's application")
  @ApiResponse(responseCode = "200", description = "Application found")
  @ApiResponse(responseCode = "404", description = "No application found for user")
  fun getApplication(authentication: JwtAuthenticationToken): Application {
    val userId = getUserIdFromToken(authentication)
    return applicationService.getApplicationByUserId(userId)
  }

  @PreAuthorize("hasAuthority('APPLICATION_CREATE')")
  @PostMapping
  @Operation(summary = "Create new application", description = "Creates a new application in DRAFT status")
  @ApiResponse(responseCode = "200", description = "Application created successfully")
  @ApiResponse(responseCode = "409", description = "Application already exists")
  fun createApplication(
    authentication: JwtAuthenticationToken,
    @Valid @RequestBody request: ApplicationRequest
  ): Application {
    val userId = getUserIdFromToken(authentication)
    return applicationService.createApplication(userId, request)
  }

  @PutMapping
  @Operation(summary = "Update draft application", description = "Updates an existing application in DRAFT status")
  @ApiResponse(responseCode = "200", description = "Application updated successfully")
  @ApiResponse(responseCode = "404", description = "Application not found")
  @ApiResponse(responseCode = "409", description = "Application is not in DRAFT status")
  fun updateApplication(
    authentication: JwtAuthenticationToken,
    @Valid @RequestBody request: ApplicationRequest
  ): Application {
    val userId = getUserIdFromToken(authentication)
    return applicationService.updateApplication(userId, request)
  }

  @PostMapping("/submit")
  @Operation(summary = "Submit application", description = "Submits a DRAFT application for review")
  @ApiResponse(responseCode = "200", description = "Application submitted successfully")
  @ApiResponse(responseCode = "404", description = "Application not found")
  @ApiResponse(responseCode = "409", description = "Application is not in DRAFT status")
  fun submitApplication(authentication: JwtAuthenticationToken): Application {
    val userId = getUserIdFromToken(authentication)
    return applicationService.submitApplication(userId)
  }

  private fun getUserIdFromToken(authentication: JwtAuthenticationToken): UUID {
    return try {
      UUID.fromString(authentication.token.claims["sub"] as String)
    } catch (e: Exception) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID in token")
    }
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
