package com.cakeshop.service;

import com.cakeshop.dto.AuthResponse;
import com.cakeshop.dto.LoginRequest;
import com.cakeshop.dto.RegisterRequest;
import com.cakeshop.entity.Role;
import com.cakeshop.entity.User;
import com.cakeshop.exception.BadRequestException;
import com.cakeshop.repository.UserRepository;
import com.cakeshop.security.JwtService;
import java.util.Set;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthService(UserRepository userRepository,
                     PasswordEncoder passwordEncoder,
                     JwtService jwtService,
                     AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new BadRequestException("Email already registered");
    }

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setFullName(request.getFullName());
    user.setRoles(Set.of(Role.ROLE_USER));

    userRepository.save(user);

    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName());
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new BadRequestException("Invalid credentials"));

    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName());
  }
}
