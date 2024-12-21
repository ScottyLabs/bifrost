package com.bifrost.resource.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.presigner.S3Presigner

@Configuration
class S3Config(
  @Value("\${aws.access-key-id}") private val accessKeyId: String,
  @Value("\${aws.secret-access-key}") private val secretAccessKey: String,
  @Value("\${aws.region}") private val region: String
) {
  @Bean
  fun s3Client(): S3Client {
    val credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey)

    return S3Client.builder()
      .region(Region.of(region))
      .credentialsProvider(StaticCredentialsProvider.create(credentials))
      .build()
  }

  @Bean
  fun s3Presigner(): S3Presigner {
    val credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey)

    return S3Presigner.builder()
      .region(Region.of(region))
      .credentialsProvider(StaticCredentialsProvider.create(credentials))
      .build()
  }
}
