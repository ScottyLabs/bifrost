package com.bifrost.resource.service

import com.bifrost.resource.controller.ApplicationRequest
import com.bifrost.resource.model.Application
import com.bifrost.resource.model.ApplicationStatus
import com.bifrost.resource.repository.ApplicationRepository
import com.bifrost.resource.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class ApplicationService(
  private val applicationRepository: ApplicationRepository,
  private val userRepository: UserRepository
) {
  fun getApplicationByUserId(userId: UUID): Application? {
    return applicationRepository.findByUserId(userId)
  }

  @Transactional
  fun createApplication(userId: UUID, request: ApplicationRequest): Application? {
    val user = userRepository.findById(userId).orElse(null) ?: return null

    if (applicationRepository.findByUserId(userId) != null) {
      return null
    }

    val application = Application(
      user = user,
      status = ApplicationStatus.DRAFT,
      name = request.name,
      email = request.email,
      phone = request.phone,
      school = request.school,
      grade = request.grade,
      age = request.age,
      gender = request.gender,
      ethnicity = request.ethnicity,
      city = request.city,
      major = request.major,
      relevantCoursework = request.relevantCoursework.toSet(),
      programmingLanguages = request.programmingLanguages.toSet(),
      previousProgrammingExperience = request.previousProgrammingExperience,
      essayQuestion1 = request.essayQuestion1,
      githubUrl = request.githubUrl,
      linkedinUrl = request.linkedinUrl,
      resumeUrl = request.resumeUrl,
      designPortfolioUrl = request.designPortfolioUrl,
      dietaryRestrictions = request.dietaryRestrictions,
      tshirtSize = request.tshirtSize,
      accessibilityNeeds = request.accessibilityNeeds,
      travelReimbursementAcknowledgement = request.travelReimbursementAcknowledgement,
      travelReimbursementDetails = request.travelReimbursementDetails,
      codeOfConductAcknowledgement = request.codeOfConductAcknowledgement,
      privacyPolicyAcknowledgement = request.privacyPolicyAcknowledgement,
      termsAndConditionsAcknowledgement = request.termsAndConditionsAcknowledgement,
      photoReleaseAcknowledgement = request.photoReleaseAcknowledgement
    )

    return applicationRepository.save(application)
  }

  @Transactional
  fun updateApplication(userId: UUID, request: ApplicationRequest): Application? {
    val application = applicationRepository.findByUserId(userId) ?: return null

    if (application.status != ApplicationStatus.DRAFT) {
      return null
    }

    application.apply {
      name = request.name
      email = request.email
      phone = request.phone
      school = request.school
      grade = request.grade
      age = request.age
      gender = request.gender
      ethnicity = request.ethnicity
      city = request.city
      major = request.major
      relevantCoursework = request.relevantCoursework.toSet()
      programmingLanguages = request.programmingLanguages.toSet()
      previousProgrammingExperience = request.previousProgrammingExperience
      essayQuestion1 = request.essayQuestion1
      githubUrl = request.githubUrl
      linkedinUrl = request.linkedinUrl
      resumeUrl = request.resumeUrl
      designPortfolioUrl = request.designPortfolioUrl
      dietaryRestrictions = request.dietaryRestrictions
      tshirtSize = request.tshirtSize
      accessibilityNeeds = request.accessibilityNeeds
      travelReimbursementAcknowledgement = request.travelReimbursementAcknowledgement
      travelReimbursementDetails = request.travelReimbursementDetails
      codeOfConductAcknowledgement = request.codeOfConductAcknowledgement
      privacyPolicyAcknowledgement = request.privacyPolicyAcknowledgement
      termsAndConditionsAcknowledgement = request.termsAndConditionsAcknowledgement
      photoReleaseAcknowledgement = request.photoReleaseAcknowledgement
    }

    return applicationRepository.save(application)
  }

  @Transactional
  fun submitApplication(userId: UUID): Application? {
    val application = applicationRepository.findByUserId(userId) ?: return null

    if (application.status != ApplicationStatus.DRAFT) {
      return null
    }

    if (!validateApplicationForSubmission(application)) {
      return null
    }

    application.status = ApplicationStatus.SUBMITTED
    return applicationRepository.save(application)
  }

  private fun validateApplicationForSubmission(application: Application): Boolean {
    return application.codeOfConductAcknowledgement &&
      application.privacyPolicyAcknowledgement &&
      application.termsAndConditionsAcknowledgement &&
      application.photoReleaseAcknowledgement
  }
}
