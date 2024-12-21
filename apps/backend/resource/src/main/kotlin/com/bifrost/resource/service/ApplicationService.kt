package com.bifrost.resource.service

import com.bifrost.resource.controller.ApplicationRequest
import com.bifrost.resource.model.Application
import com.bifrost.resource.model.ApplicationStatus
import com.bifrost.resource.model.DraftApplication
import com.bifrost.resource.model.SubmittedApplication
import com.bifrost.resource.repository.ApplicationRepository
import com.bifrost.resource.repository.UserRepository
import jakarta.validation.ValidationException
import jakarta.validation.Validator
import org.apache.tomcat.util.http.fileupload.FileUploadException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*


@Service
class ApplicationService(
  private val applicationRepository: ApplicationRepository,
  private val userRepository: UserRepository,
  private val s3Service: S3Service,
  private val validator: Validator
) {
  val logger = LoggerFactory.getLogger(ApplicationService::class.java)

  fun getApplicationByUserId(userId: UUID): Application? {
    return applicationRepository.findByUserId(userId)
  }

  @Transactional
  fun createApplication(userId: UUID, request: ApplicationRequest): Application {
    val user = userRepository.findById(userId).orElseThrow {
      RuntimeException("User with id $userId not found")
    }

    if (applicationRepository.existsByUserId(userId)) {
      throw RuntimeException("Application already exists for user with id $userId")
    }

    val draft = DraftApplication(user)

    applicationRepository.save(draft)
    return updateApplication(userId, request)
  }

  @Transactional
  fun updateApplication(userId: UUID, request: ApplicationRequest): Application {
    val application = applicationRepository.findByUserId(userId) ?: throw RuntimeException("Application not found")

    if (application.status != ApplicationStatus.DRAFT) {
      throw RuntimeException("Application is not in draft status")
    }

    request.resume?.let {
      try {
        val newResumeUrl = s3Service.uploadFile(it, "resumes")
        val oldResumeUrl = application.resumeUrl
        application.resumeUrl = newResumeUrl
        oldResumeUrl?.let { s3Service.deleteFile(it) }
      } catch (e: Exception) {
        logger.error("Failed to upload resume", e)
        throw FileUploadException("Failed to upload resume", e)
      }
    }


    application.apply {
      request.first_name?.let { first_name = it }
      request.last_name?.let { last_name = it }
      request.age?.let { age = it }
      request.email?.let { email = it }
      request.phone?.let { phone = it }
      request.school?.let { school = it }
      request.grade?.let { grade = it }
      request.gender?.let { gender = it }
      request.ethnicity?.let { ethnicity = it }
      request.city?.let { city = it }
      request.country?.let { country = it }
      request.major?.let { major = it }
      request.relevantCoursework?.let { relevantCoursework = it.toSet() }
      request.programmingLanguages?.let { programmingLanguages = it.toSet() }
      request.previousProgrammingExperience?.let { previousProgrammingExperience = it }
      request.essayQuestion1?.let { essayQuestion1 = it }
      request.githubUrl?.let { githubUrl = it }
      request.linkedinUrl?.let { linkedinUrl = it }
      request.personalWebsiteUrl?.let { personalWebsiteUrl = it }
      request.dietaryRestrictions?.let { dietaryRestrictions = it }
      request.tshirtSize?.let { tshirtSize = it }
      request.accessibilityNeeds?.let { accessibilityNeeds = it }
      request.travelReimbursementAcknowledgement?.let { travelReimbursementAcknowledgement = it }
      request.travelReimbursementDetails?.let { travelReimbursementDetails = it }
      request.mlhEmailSubscription?.let { mlhEmailSubscription = it }
    }

    return applicationRepository.save(application)
  }

  @Transactional
  fun submitApplication(userId: UUID): Application {
    logger.info("Submitting application for user: $userId")

    val application = applicationRepository.findByUserId(userId)
      ?: throw RuntimeException("Application not found for user with id $userId")

    if (application !is DraftApplication) {
      throw RuntimeException("Application is not in draft status")
    }

    val submitted = try {
      SubmittedApplication.from(application)
    } catch (e: IllegalArgumentException) {
      throw RuntimeException("Failed to submit application", e)
    }

    val violations = validator.validate(submitted)
    if (violations.isNotEmpty()) {
      val errors = violations.map { "${it.propertyPath}: ${it.message}" }
      throw ValidationException("Application validation failed: ${errors.joinToString()}")
    }

    return try {
      applicationRepository.delete(application)
      applicationRepository.save(submitted)
    } catch (e: Exception) {
      logger.error("Failed to submit application", e)
      throw RuntimeException("Failed to submit application", e)
    }
  }

}
