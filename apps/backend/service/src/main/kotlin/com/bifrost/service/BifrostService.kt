package com.bifrost.service

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BifrostApplication

fun main(args: Array<String>) {
  runApplication<BifrostApplication>(*args)
}
