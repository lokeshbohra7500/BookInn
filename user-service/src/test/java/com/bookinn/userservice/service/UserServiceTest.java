package com.bookinn.userservice.service;

import com.bookinn.userservice.dto.RegisterRequestDto;
import com.bookinn.userservice.dto.UpdateUserRequestDto;
import com.bookinn.userservice.entity.User;
import com.bookinn.userservice.repository.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepo repo;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setup() throws Exception {
        repo = mock(UserRepo.class);
        passwordEncoder = mock(PasswordEncoder.class);

        userService = new UserService(passwordEncoder);

        // inject repo manually
        Field repoField = UserService.class.getDeclaredField("repo");
        repoField.setAccessible(true);
        repoField.set(userService, repo);
    }

    @Test
    void testViewAll() {
        User user = new User();
        user.setUserId(1L);
        user.setFirstName("Lokesh");
        user.setLastName("Bohra");
        user.setEmail("test@test.com");

        when(repo.findAll()).thenReturn(List.of(user));

        var result = userService.viewAll();

        assertEquals(1, result.size());
        assertEquals("Lokesh", result.get(0).getFirstName());
    }

    @Test
    void testGetById() {
        User user = new User();
        user.setUserId(1L);
        user.setFirstName("Lokesh");

        when(repo.findById(1L)).thenReturn(Optional.of(user));

        var result = userService.getById(1L);

        assertEquals("Lokesh", result.getFirstName());
    }

    @Test
    void testRegister() {
        RegisterRequestDto dto = new RegisterRequestDto();
        dto.setFirstName("Lokesh");
        dto.setLastName("Bohra");
        dto.setEmail("test@test.com");
        dto.setPassword("123");

        when(repo.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("123")).thenReturn("encoded");

        var result = userService.register(dto);

        assertEquals("Lokesh", result.getFirstName());
        verify(repo, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateMe() throws Exception {
        // mock authentication
        var auth = mock(org.springframework.security.core.Authentication.class);
        when(auth.getName()).thenReturn("test@test.com");
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setEmail("test@test.com");

        when(repo.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        UpdateUserRequestDto dto = new UpdateUserRequestDto();
        dto.setFirstName("Updated");

        var result = userService.updateMe(dto);

        assertEquals("Updated", result.getFirstName());
        verify(repo).save(user);
    }
}
