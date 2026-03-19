package com.bookinn.userservice.service;

import com.bookinn.userservice.entity.User;
import com.bookinn.userservice.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Test
    void testViewAll() throws Exception {

        // create mocks
        UserRepo repo = mock(UserRepo.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // create service manually
        UserService userService = new UserService(passwordEncoder);

        // 🔥 inject repo manually using reflection (fix for your issue)
        Field repoField = UserService.class.getDeclaredField("repo");
        repoField.setAccessible(true);
        repoField.set(userService, repo);

        // dummy user
        User user = new User();
        user.setUserId(1L);
        user.setFirstName("Lokesh");
        user.setLastName("Bohra");
        user.setEmail("test@test.com");

        // mock repo behavior
        when(repo.findAll()).thenReturn(List.of(user));

        // call service
        var result = userService.viewAll();

        // assertions
        assertEquals(1, result.size());
        assertEquals("Lokesh", result.get(0).getFirstName());
    }
}
