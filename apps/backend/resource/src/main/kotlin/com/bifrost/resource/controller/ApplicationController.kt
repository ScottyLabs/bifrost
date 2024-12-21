package com.bifrost.resource.controller

import com.bifrost.resource.model.*
import com.bifrost.resource.service.ApplicationService
import com.bifrost.resource.service.UserService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
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

  @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
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
  val first_name: String? = null,
  val last_name: String? = null,
  val age: Int? = null,
  val phone: String? = null,
  val email: String? = null,
  val school: String? = null,
  val grade: Grade? = null,
  val gender: Gender? = null,
  val ethnicity: Ethnicity? = null,
  val city: String? = null,
  val country: Country? = null,
  val major: String? = null,
  val relevantCoursework: List<String>? = null,
  val programmingLanguages: List<String>? = null,
  val previousProgrammingExperience: Boolean? = null,
  val essayQuestion1: String? = null,
  val resume: MultipartFile? = null,
  val githubUrl: String? = null,
  val linkedinUrl: String? = null,
  val personalWebsiteUrl: String? = null,
  val dietaryRestrictions: String? = null,
  val tshirtSize: TShirtSize? = null,
  val accessibilityNeeds: String? = null,
  val travelReimbursementAcknowledgement: Boolean? = null,
  val travelReimbursementDetails: String? = null,
  val codeOfConductAcknowledgement: Boolean? = null,
  val photoReleaseAcknowledgement: Boolean? = null,
  val mlhCodeOfConductAcknowledgement: Boolean? = null,
  val mlhPrivacyPolicyAcknowledgement: Boolean? = null,
  val mlhEmailSubscription: Boolean? = null,
)
