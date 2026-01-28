package com.bookinn.userservice.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bookinn.userservice.dto.RegisterRequestDto;
import com.bookinn.userservice.dto.UpdateUserRequestDto;
import com.bookinn.userservice.dto.UserResponseDto;
import com.bookinn.userservice.entity.Role;
import com.bookinn.userservice.entity.Status;
import com.bookinn.userservice.entity.User;
import com.bookinn.userservice.exception.DuplicateEmailException;
import com.bookinn.userservice.exception.UserNotFoundException;
import com.bookinn.userservice.repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService{
	@Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
	private UserRepo repo;
    
    private UserResponseDto mapToDto(User user) {
        UserResponseDto res = new UserResponseDto();
        res.setUserId(user.getUserId());
        res.setFirstName(user.getFirstName());
        res.setLastName(user.getLastName());
        res.setEmail(user.getEmail());
        res.setCity(user.getCity());
        res.setState(user.getState());
        res.setRole(user.getRole());
        res.setStatus(user.getStatus());
        return res;
    }
    //=========
    //register_User
    //=========
    public UserResponseDto register(RegisterRequestDto dto) {
    	  if (repo.existsByEmail(dto.getEmail())) {
              throw new DuplicateEmailException("Email already registered: " + dto.getEmail());
          }
		User user = new User();
		user.setFirstName(dto.getFirstName());
		user.setLastName(dto.getLastName());
		user.setEmail(dto.getEmail());
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setRole(Role.CUSTOMER);
		user.setStatus(Status.ACTIVE);
		user.setCity(dto.getCity());
		user.setState(dto.getCity());
		
		repo.save(user);
		
		 return mapToDto(user);
	}
    //=========
    //get all user
    //=========
    public List<UserResponseDto> viewAll(){
    	List<UserResponseDto> list= new ArrayList<>();
    	List<User> users = repo.findAll();
    	for(User user: users) {
    		UserResponseDto res = new UserResponseDto();
    		res = mapToDto(user);
    		list.add(res);
    	}
    	return list;
    }
    //=========
    //get user by id
    //=========
    public UserResponseDto getById(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }
    //=========
    //current_User
    //=========
    public UserResponseDto getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // comes from JWT subject

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return mapToDto(user);
    }
    //=========
    //update_User
    //=========
    public UserResponseDto updateMe(UpdateUserRequestDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setCity(dto.getCity());
        user.setState(dto.getState());

        repo.save(user);

        return mapToDto(user);
    }

}
