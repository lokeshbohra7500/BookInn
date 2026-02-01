package com.bookinn.userservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinn.userservice.dto.RegisterRequestDto;
import com.bookinn.userservice.dto.UpdateUserRequestDto;
import com.bookinn.userservice.dto.UserResponseDto;
import com.bookinn.userservice.service.UserService;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService service;

	@PostMapping("/register")
	public ResponseEntity<UserResponseDto> register(@Valid @RequestBody RegisterRequestDto user) {
		UserResponseDto savedUser = service.register(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<List<UserResponseDto>> getAllUsers() {
		List<UserResponseDto> users = service.viewAll();

		if (users.isEmpty()) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(users);
	}

	@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
	@GetMapping("/get/{id}")
	public ResponseEntity<UserResponseDto> getUserById(
			@Parameter(description = "User ID", required = true) @PathVariable("id") Long id) {
		UserResponseDto user = service.getById(id);
		return ResponseEntity.ok(user);
	}

	@PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
	@GetMapping("/me")
	public ResponseEntity<UserResponseDto> getMe() {
		return ResponseEntity.ok(service.getMe());
	}

	@PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
	@PutMapping("/update")
	public ResponseEntity<UserResponseDto> updateMe(
			@Valid @RequestBody UpdateUserRequestDto dto) {

		return ResponseEntity.ok(service.updateMe(dto));
	}

}
