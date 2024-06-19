package com.WoofWalk.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthConfigController {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String auth0Domain;

    @Value("${auth0.audience}")
    private String auth0Audience;

    @GetMapping("/auth-config")
    public Map<String, String> getAuthConfig() {
        return Map.of(
                "domain", auth0Domain,
                "audience", auth0Audience
        );
    }

}
