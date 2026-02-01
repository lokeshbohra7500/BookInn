package com.bookinn.userservice.dto;

import com.bookinn.userservice.entity.Role;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private String email;
    private Long userId;
    private Role role;
}
