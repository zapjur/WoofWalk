package com.WoofWalk.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		String secretJson = AWSSecretManagerService.getSecret("secrets/woof-walk", "eu-north-1");

		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode secrets;
		try {
			secrets = objectMapper.readTree(secretJson);
		} catch (IOException e) {
			throw new RuntimeException("Failed to parse secrets JSON", e);
		}

		System.out.println("Secrets JSON: " + secrets.toString());

		setSystemProperty("spring.datasource.url", secrets.get("rds.databaseURL"));
		setSystemProperty("spring.datasource.username", secrets.get("rds.databaseUsername"));
		setSystemProperty("spring.datasource.password", secrets.get("rds.databasePassword"));
		setSystemProperty("spring.security.oauth2.resourceserver.jwt.issuer-uri", secrets.get("auth0.issuerURI"));
		setSystemProperty("aws.accessKeyId", secrets.get("aws.accessKeyId"));
		setSystemProperty("aws.secretAccessKey", secrets.get("aws.secretAccessKey"));
		setSystemProperty("auth0.audience", secrets.get("auth0.audience"));

		SpringApplication.run(BackendApplication.class, args);
	}

	private static void setSystemProperty(String key, JsonNode value) {
		if (value != null && !value.isNull()) {
			System.setProperty(key, value.asText());
		} else {
			throw new RuntimeException("Missing required secret for key: " + key);
		}
	}
}
