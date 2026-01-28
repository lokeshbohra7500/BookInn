package com.bookinn.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequestDto {
	@NotNull
    private String firstName;
	@NotNull
    private String lastName;
	@NotNull
	@Email
    private String email;
	@NotNull
    private String password;  
	@NotNull
    private String city;
	@NotNull
    private String state;
}