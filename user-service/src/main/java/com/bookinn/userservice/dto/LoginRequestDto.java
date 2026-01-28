package com.bookinn.userservice.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}

