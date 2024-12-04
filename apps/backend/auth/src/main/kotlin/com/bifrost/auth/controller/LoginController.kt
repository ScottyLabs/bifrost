package com.bifrost.auth.controller

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping

@Controller
class LoginController {
    private val logger = LoggerFactory.getLogger(LoginController::class.java)

    @GetMapping("/login")
    fun loginPage(model: Model, request: HttpServletRequest): String {
        logger.debug("Login endpoint hit")

        val error = request.getParameter("error")
        if (error != null) {
            model.addAttribute("error", "Invalid credentials")
        }

        return "login"
    }
}
