package com.bifrost.resource.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.util.*

@Service
class S3Service(
  @Value("\${aws.s3.bucket}") private val bucketName: String,
  private val s3Client: S3Client
) {
  fun uploadFile(file: MultipartFile, prefix: String): String {
    val fileName = "${prefix}/${UUID.randomUUID()}-${file.originalFilename}"

    val putObjectRequest = PutObjectRequest.builder()
      .bucket(bucketName)
      .key(fileName)
      .contentType(file.contentType)
      .build()

    s3Client.putObject(
      putObjectRequest,
      RequestBody.fromInputStream(file.inputStream, file.size)
    )

    return fileName
  }

  fun deleteFile(fileName: String) {
    s3Client.deleteObject { builder ->
      builder.bucket(bucketName).key(fileName)
    }
  }
}
