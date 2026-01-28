package com.bookinn.userservice.dto;

import com.bookinn.userservice.entity.Role;
import com.bookinn.userservice.entity.Status;

import lombok.Data;

@Data
public class UserResponseDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Status status;
    private String city;
    private String state;
}
