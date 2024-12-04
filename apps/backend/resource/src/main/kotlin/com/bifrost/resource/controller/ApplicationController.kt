package com.bifrost.resource.controller


import com.bifrost.resource.model.Application
import com.bifrost.resource.repository.ApplicationRepository
import com.bifrost.resource.repository.UserRepository
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/applications")
@Validated
@Tag(name = "Applications")
class ApplicationController(
  private val applicationRepository: ApplicationRepository,
  private val userRepository: UserRepository
) {
  @GetMapping
  fun getApplication(authentication: JwtAuthenticationToken): ResponseEntity<Application> {
    val userId = UUID.fromString(authentication.token.claims["sub"] as String)
    val application = applicationRepository.findByUserId(userId)
      ?: return ResponseEntity.notFound().build()
    return ResponseEntity.ok(application)
  }

  @PostMapping
  fun submitApplication(
    authentication: JwtAuthenticationToken,
    @RequestBody form: Application
  ): ResponseEntity<Application> {
    val userId = UUID.fromString(authentication.token.claims["sub"] as String)

    val user = userRepository.findById(userId)
      .orElseThrow { RuntimeException("User not found") }

    val existingApplication = applicationRepository.findByUserId(userId)

    val savedForm = if (existingApplication != null) {
      applicationRepository.save(
        existingApplication.copy(
          essayQuestion1 = form.essayQuestion1,
          essayQuestion2 = form.essayQuestion2,
          github = form.github,
          designPortfolio = form.designPortfolio,
          resumeFilePath = form.resumeFilePath
        )
      )
    } else {
      applicationRepository.save(
        form.copy(user = user)
      )
    }

    return ResponseEntity.ok(savedForm)
  }

}
