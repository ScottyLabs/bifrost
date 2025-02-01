package com.bifrost.resource.config

import com.bifrost.resource.model.AccessLevel
import com.bifrost.resource.model.User
import com.bifrost.resource.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component

@Component
class DataLoader(
  private val userRepository: UserRepository
) {
  @Bean
  fun seedDatabase() = CommandLineRunner {
    if (userRepository.count() == 0L) {
      userRepository.saveAll(
        listOf(
          User(
            externalId = "81decf9f-e1ce-4208-94aa-32c98e3eef1e",
            accessLevels = mutableSetOf(AccessLevel.PARTICIPANT)
          ),
        )
      )
    }
  }
}
