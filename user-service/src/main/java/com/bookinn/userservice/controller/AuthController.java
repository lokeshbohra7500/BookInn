package com.bookinn.userservice.controller;

import com.bookinn.userservice.dto.AuthResponseDto;
import com.bookinn.userservice.dto.LoginRequestDto;
import com.bookinn.userservice.entity.User;
import com.bookinn.userservice.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto request) {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);

        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
//        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return ResponseEntity.ok(response);
    }
}
