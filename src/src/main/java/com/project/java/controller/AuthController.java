package com.project.java.controller;

import com.project.java.DTO.AuthResponse;
import com.project.java.DTO.LoginRequest;
import com.project.java.DTO.RegisterRequest;
import com.project.java.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authenticationService.register(request);
    }

    /*@PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authenticationService.login(request);
    }*/

    @PostMapping("/login")
    public AuthResponse login(Authentication authentication)
    {
        return authenticationService.login(authentication);
    }
}
