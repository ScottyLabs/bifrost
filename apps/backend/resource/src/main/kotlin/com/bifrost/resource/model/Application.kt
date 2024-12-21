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
sealed class Application(
  @Id @GeneratedValue(strategy = GenerationType.UUID)
  val id: UUID = UUID.randomUUID(),

  @OneToOne @JoinColumn(name = "user_id", nullable = false)
  val user: User,

  @Size(min = 2, max = 100)
  var first_name: String? = null,

  @Size(min = 2, max = 100)
  var last_name: String? = null,

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

  @Enumerated(EnumType.STRING)
  var country: Country? = null,

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
  var essayQuestion1: String? = null,

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

  @Column(nullable = false)
  var mlhEmailSubscription : Boolean = false,

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
  first_name = requireNotNull(draft.first_name) { "First name is required" },
  last_name = requireNotNull(draft.last_name) { "Last name is required" },
  age = requireNotNull(draft.age) { "Age is required" },
  email = requireNotNull(draft.email) { "Email is required" },
  phone = requireNotNull(draft.phone) { "Phone is required" },
  school = requireNotNull(draft.school) { "School is required" },
  grade = requireNotNull(draft.grade) { "Grade is required" },
  gender = requireNotNull(draft.gender) { "Gender is required" },
  ethnicity = requireNotNull(draft.ethnicity) { "Ethnicity is required" },
  city = requireNotNull(draft.city) { "City is required" },
  country = requireNotNull(draft.country) { "Country is required" },
  major = requireNotNull(draft.major) { "Major is required" },
  relevantCoursework = draft.relevantCoursework,
  programmingLanguages = draft.programmingLanguages,
  previousProgrammingExperience = requireNotNull(draft.previousProgrammingExperience) { "Previous programming experience is required" },
  essayQuestion1 = requireNotNull(draft.essayQuestion1) { "Essay question must be answered" },
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
  travelReimbursementDetails = draft.travelReimbursementDetails,
  mlhEmailSubscription = draft.mlhEmailSubscription
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

enum class Country {
  ABW, AFG, AGO, AIA, ALA, ALB, AND, ARE, ARG, ARM, ASM, ATA, ATF, ATG, AUS, AUT, AZE, BDI, BEL, BEN, BES, BFA, BGD, BGR, BHR, BHS, BIH, BLM, BLR, BLZ, BMU, BOL, BRA, BRB, BRN, BTN, BVT, BWA, CAF, CAN, CCK, CHE, CHL, CHN, CIV, CMR, COD, COG, COK, COL, COM, CPV, CRI, CUB, CUW, CXR, CYM, CYP, CZE, DEU, DJI, DMA, DNK, DOM, DZA, ECU, EGY, ERI, ESH, ESP, EST, ETH, FIN, FJI, FLK, FRA, FRO, FSM, GAB, GBR, GEO, GGY, GHA, GIB, GIN, GLP, GMB, GNB, GNQ, GRC, GRD, GRL, GTM, GUF, GUM, GUY, HKG, HMD, HND, HRV, HTI, HUN, IDN, IMN, IND, IOT, IRL, IRN, IRQ, ISL, ISR, ITA, JAM, JEY, JOR, JPN, KAZ, KEN, KGZ, KHM, KIR, KNA, KOR, KWT, LAO, LBN, LBR, LBY, LCA, LIE, LKA, LSO, LTU, LUX, LVA, MAC, MAF, MAR, MCO, MDA, MDG, MDV, MEX, MHL, MKD, MLI, MLT, MMR, MNE, MNG, MNP, MOZ, MRT, MSR, MTQ, MUS, MWI, MYS, MYT, NAM, NCL, NER, NFK, NGA, NIC, NIU, NLD, NOR, NPL, NRU, NZL, OMN, PAK, PAN, PCN, PER, PHL, PLW, PNG, POL, PRI, PRK, PRT, PRY, PSE, PYF, QAT, REU, ROU, RUS, RWA, SAU, SDN, SEN, SGP, SGS, SHN, SJM, SLB, SLE, SLV, SMR, SOM, SPM, SRB, SSD, STP, SUR, SVK, SVN, SWE, SWZ, SXM, SYC, SYR, TCA, TCD, TGO, THA, TJK, TKL, TKM, TLS, TON, TTO, TUN, TUR, TUV, TWN, TZA, UGA, UKR, UMI, URY, USA, UZB, VAT, VCT, VEN, VGB, VIR, VNM, VUT, WLF, WSM, YEM, ZAF, ZMB, ZWE, 
}
