package com.bifrost.resource.model

import jakarta.persistence.*
import jakarta.validation.constraints.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.validator.constraints.URL
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "applications")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "status", discriminatorType = DiscriminatorType.STRING)
class Application(
  @Id @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID = UUID.randomUUID(),

  @OneToOne @JoinColumn(name = "user_id", nullable = false)
  val user: User,

  @Size(min = 2, max = 100)
  var name: String? = null,

  @Email
  var email: String? = null,

  @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
  var phone: String? = null,

  @Size(min = 2, max = 100)
  var school: String? = null,

  @Enumerated(EnumType.STRING)
  var grade: Grade? = null,

  @Min(13) @Max(100)
  var age: Int? = null,

  @Enumerated(EnumType.STRING)
  var gender: Gender? = null,

  @Enumerated(EnumType.STRING)
  var ethnicity: Ethnicity? = null,

  @Size(min = 2, max = 100)
  var city: String? = null,

  @Size(min = 2, max = 100)
  var major: String? = null,

  @ElementCollection
  @CollectionTable(name = "application_coursework", joinColumns = [JoinColumn(name = "application_id")])
  var relevantCoursework: Set<String> = setOf(),

  @ElementCollection
  @CollectionTable(name = "application_programming_languages", joinColumns = [JoinColumn(name = "application_id")])
  var programmingLanguages: Set<String> = setOf(),

  var previousProgrammingExperience: Boolean? = null,

  @Column(columnDefinition = "TEXT")
  @Size(min = 100, max = 5000)
  var statement: String? = null,

  @URL
  var githubUrl: String? = null,

  @URL
  var linkedinUrl: String? = null,

  var resumeUrl: String? = null,

  @URL
  var personalWebsiteUrl: String? = null,

  @Size(max = 500)
  var dietaryRestrictions: String? = null,

  @Enumerated(EnumType.STRING)
  var tshirtSize: TShirtSize? = null,

  @Size(max = 500)
  var accessibilityNeeds: String? = null,

  var travelReimbursementAcknowledgement: Boolean = false,

  @Size(max = 1000)
  var travelReimbursementDetails: String? = null,

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, insertable = false, updatable = false)
  var status: ApplicationStatus = ApplicationStatus.DRAFT,

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  val createdAt: LocalDateTime = LocalDateTime.now(),

  @UpdateTimestamp
  @Column(nullable = false)
  var updatedAt: LocalDateTime = LocalDateTime.now(),

  @Version
  var version: Long = 0
)

@Entity
@DiscriminatorValue("DRAFT")
class DraftApplication(
  user: User
) : Application(user = user)

@Entity
@DiscriminatorValue("SUBMITTED")
class SubmittedApplication private constructor(
  draft: DraftApplication,
  val submittedAt: LocalDateTime = LocalDateTime.now()
) : Application(
  user = draft.user,
  name = requireNotNull(draft.name) { "Name is required" },
  email = requireNotNull(draft.email) { "Email is required" },
  phone = requireNotNull(draft.phone) { "Phone is required" },
  school = requireNotNull(draft.school) { "School is required" },
  grade = requireNotNull(draft.grade) { "Grade is required" },
  age = requireNotNull(draft.age) { "Age is required" },
  gender = requireNotNull(draft.gender) { "Gender is required" },
  ethnicity = requireNotNull(draft.ethnicity) { "Ethnicity is required" },
  city = requireNotNull(draft.city) { "City is required" },
  major = requireNotNull(draft.major) { "Major is required" },
  relevantCoursework = draft.relevantCoursework,
  programmingLanguages = draft.programmingLanguages,
  previousProgrammingExperience = requireNotNull(draft.previousProgrammingExperience) { "Previous programming experience is required" },
  statement = requireNotNull(draft.statement) { "Essay question must be answered" },
  resumeUrl = requireNotNull(draft.resumeUrl) { "Resume is required" },
  githubUrl = draft.githubUrl,
  linkedinUrl = draft.linkedinUrl,
  personalWebsiteUrl = draft.personalWebsiteUrl,
  dietaryRestrictions = draft.dietaryRestrictions,
  tshirtSize = requireNotNull(draft.tshirtSize) { "T-shirt size is required" },
  accessibilityNeeds = draft.accessibilityNeeds,
  travelReimbursementAcknowledgement = draft.travelReimbursementAcknowledgement.also {
    require(it) { "Travel reimbursement acknowledgement is required" }
  },
  travelReimbursementDetails = draft.travelReimbursementDetails
) {
  companion object {
    fun from(draft: DraftApplication): SubmittedApplication = SubmittedApplication(draft)
  }
}

enum class ApplicationStatus {
  DRAFT,
  SUBMITTED,
  ACCEPTED,
  REJECTED,
  WAITLISTED,
  WITHDRAWN
}

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
