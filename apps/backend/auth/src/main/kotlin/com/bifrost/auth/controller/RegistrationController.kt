package com.bifrost.auth.controller

import org.slf4j.LoggerFactory
import org.springframework.security.core.userdetails.User
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.provisioning.UserDetailsManager
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.servlet.mvc.support.RedirectAttributes

@Controller
class RegistrationController(
  private val userDetailsManager: UserDetailsManager,
  private val passwordEncoder: PasswordEncoder
) {
  private val logger = LoggerFactory.getLogger(RegistrationController::class.java)

  @GetMapping("/register")
  fun registerPage(): String {
    logger.debug("Registration page requested")
    return "register"
  }

  @PostMapping("/register")
  fun register(
    @RequestParam firstName: String?,
    @RequestParam lastName: String?,
    @RequestParam email: String?,
    @RequestParam password: String?,
    redirectAttributes: RedirectAttributes
  ): String {
    logger.info("Registration attempt - email: $email, firstName: $firstName, lastName: $lastName")

    if (email.isNullOrBlank() || password.isNullOrBlank()) {
      logger.error("Missing required fields")
      redirectAttributes.addFlashAttribute("error", "All fields are required")
      return "redirect:/register"
    }

    return try {
      if (userDetailsManager.userExists(email)) {
        logger.warn("User already exists: $email")
        redirectAttributes.addFlashAttribute("error", "Email already taken.")
        return "redirect:/register"
      }

      logger.debug("Creating new user with email: $email")
      val user = User.withUsername(email)
        .password(passwordEncoder.encode(password))
        .roles("USER")
        .build()

      userDetailsManager.createUser(user)
      logger.info("Successfully created user: $email")

      redirectAttributes.addFlashAttribute("success", "Registration successful! Please sign in.")
      "redirect:/login"
    } catch (e: Exception) {
      logger.error("Registration failed", e)
      redirectAttributes.addFlashAttribute("error", "Registration failed: ${e.message}")
      "redirect:/register"
    }
  }
}
