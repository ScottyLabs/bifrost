package com.bifrost.resource.controller

import com.bifrost.resource.model.User
import com.bifrost.resource.service.UserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/webhook")
class WebhookController(
  @Autowired val userService: UserService,
  @Value("\${ory.webhook.auth-key-name}") private val authKeyName: String,
  @Value("\${ory.webhook.auth-key-value}") private val authKeyValue: String
) {
  val logger = LoggerFactory.getLogger(WebhookController::class.java)

  @PostMapping("/registration")
  @ResponseStatus(HttpStatus.OK)
  fun handleRegistrationWebhook(
    @RequestHeader headers: Map<String, String>,
    @RequestBody webhookPayload: RegistrationWebhookPayload
  ) {
    logger.info("Received registration webhook request. Payload: $webhookPayload")
    logger.debug("Headers: {}", headers)

    val authKey = headers[authKeyName]

    if (authKey != authKeyValue) {
      logger.error("Invalid auth key provided in the webhook request")
      throw IllegalArgumentException("Invalid auth key provided")
    }

    // Extract user data from the webhook payload
    val userId = webhookPayload.userId

    try {
      userService.getUserByExternalId(userId)
      logger.info("User already exists in the database")
    } catch (e: ResponseStatusException) {
      // Save or update the user in your business database
      userService.createUser(
        User(
          externalId = userId
        )
      )

      logger.info("User saved successfully")
    }
  }
}

// DTO to map the incoming webhook payload
data class RegistrationWebhookPayload(
  val userId: String
)
