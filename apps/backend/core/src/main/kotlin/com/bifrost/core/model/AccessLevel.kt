package com.scottylabs.resource.domain.model

enum class AccessLevel {
  PARTICIPANT,    // Regular hackathon participants
  MENTOR,        // Mentors who help participants
  SPONSOR,       // Company sponsors
  JUDGE,         // Project judges
  ORGANIZER,     // Hackathon organizers
  ADMIN          // System administrators
}
