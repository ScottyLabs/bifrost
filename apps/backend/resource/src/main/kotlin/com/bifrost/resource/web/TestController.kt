// src/main/kotlin/com/scottylabs/resource/web/TestController.kt
package com.bifrost.resource.web

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class TestController {

  @GetMapping("/public/test")
  fun publicEndpoint(): Map<String, String> {
    return mapOf("message" to "This is a public endpoint")
  }

  @GetMapping("/protected/test")
  fun protectedEndpoint(@AuthenticationPrincipal jwt: Jwt): Map<String, Any> {
    return mapOf(
      "message" to "This is a protected endpoint",
      "email" to (jwt.claims["email"] ?: ""),
      "sub" to jwt.subject,
      "roles" to (jwt.claims["roles"] ?: listOf<String>())
    )
  }
}
