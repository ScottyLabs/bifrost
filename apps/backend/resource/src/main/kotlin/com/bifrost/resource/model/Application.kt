package com.bifrost.resource.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.util.*

@Entity
@Table(name = "applications")
data class Application(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID = UUID.randomUUID(),

  @OneToOne
  @JoinColumn(name = "user_id", nullable = false)
  var user: User,

  @Column(nullable = false)
  var name: String,

  @Column(nullable = false)
  var email: String,

  @Column(nullable = false)
  var phone: String,

  @Column(nullable = false)
  var school: String,

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  var grade: Grade,

  @Column(nullable = false)
  var age: Int,

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  var gender: Gender,

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  var ethnicity: Ethnicity,

  @Column(nullable = false)
  var city: String,

  @Column(nullable = false)
  var major: String,

  @ElementCollection
  @CollectionTable(
    name = "application_coursework",
    joinColumns = [JoinColumn(name = "application_id")]
  )
  var relevantCoursework: Set<String> = setOf(),

  @ElementCollection
  @CollectionTable(
    name = "application_programming_languages",
    joinColumns = [JoinColumn(name = "application_id")]
  )
  var programmingLanguages: Set<String> = setOf(),

  @Column(nullable = false)
  var previousProgrammingExperience: Boolean,

  @Column(columnDefinition = "TEXT")
  var essayQuestion1: String,

  var githubUrl: String? = null,

  var linkedinUrl: String? = null,

  @Column(nullable = false)
  var resumeUrl: String,

  var designPortfolioUrl: String? = null,

  var dietaryRestrictions: String? = null,

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  var tshirtSize: TShirtSize,

  var accessibilityNeeds: String? = null,

  @Column(nullable = false)
  var travelReimbursementAcknowledgement: Boolean = false,

  var travelReimbursementDetails: String? = null,

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  var status: ApplicationStatus = ApplicationStatus.DRAFT,

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  var createdAt: Date = Date(),

  @UpdateTimestamp
  @Column(nullable = false)
  var updatedAt: Date = Date()
)

enum class Grade {
  FRESHMAN,
  SOPHOMORE,
  JUNIOR,
  SENIOR,
  GRADUATE,
  OTHER
}

enum class Gender {
  MALE,
  FEMALE,
  OTHER,
  PREFER_NOT_TO_SAY
}

enum class Ethnicity {
  NATIVE_AMERICAN,
  ASIAN_PACIFIC_ISLANDER,
  BLACK_AFRICAN_AMERICAN,
  HISPANIC_LATINO,
  WHITE_CAUCASIAN,
  MULTIPLE_OTHER,
  PREFER_NOT_TO_SAY
}

enum class TShirtSize {
  XS,
  S,
  M,
  L,
  XL,
  XXL
}

enum class ApplicationStatus {
  DRAFT,
  SUBMITTED,
  ACCEPTED,
  REJECTED,
  WAITLISTED,
  WITHDRAWN
}

