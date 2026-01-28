package com.bookinn.userservice.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bookinn.userservice.repository.UserRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{
	 private UserRepo userRepo;

	    @Override
	    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	        return userRepo.findByEmail(email)
	                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
	    }
}
