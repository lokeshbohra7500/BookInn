package com.bookinn.userservice.service;

import com.bookinn.userservice.entity.User;
import com.bookinn.userservice.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo repo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void testViewAll() {
        // manually inject dependencies
        UserService userService = new UserService(passwordEncoder);
        userService.repo = repo; // 👈 THIS LINE FIXES YOUR ISSUE

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
}
