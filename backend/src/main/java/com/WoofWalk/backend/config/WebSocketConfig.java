package com.WoofWalk.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtDecoder jwtDecoder;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                .addInterceptors(new HttpSessionHandshakeInterceptor() {
                    @Override
                    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                        if (request instanceof ServletServerHttpRequest) {
                            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
                            String token = servletRequest.getServletRequest().getParameter("token");
                            System.out.println("Received token: " + token); // Logowanie tokenu
                            if (token != null && validateToken(token)) {
                                attributes.put("token", token);
                                return true;
                            } else {
                                System.err.println("Invalid token or token not found");
                            }
                        }
                        response.setStatusCode(HttpStatus.BAD_REQUEST);
                        return false;
                    }
                });
    }

    private boolean validateToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            System.out.println("Decoded JWT: " + jwt); // Logowanie dekodowanego JWT
            // Możesz dodać dodatkową logikę walidacji tutaj
            System.out.println("Token is valid"); // Logowanie walidacji tokenu
            return true;
        } catch (JwtException e) {
            System.err.println("Token validation failed: " + e.getMessage()); // Logowanie błędu walidacji
            return false;
        }
    }
}
