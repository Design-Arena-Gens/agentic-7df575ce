package com.cakeshop.security;

import com.cakeshop.entity.User;
import com.cakeshop.repository.UserRepository;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CakeUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public CakeUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return new org.springframework.security.core.userdetails.User(
        user.getEmail(),
        user.getPassword(),
        user.getRoles().stream()
            .map(role -> (GrantedAuthority) new SimpleGrantedAuthority(role.name()))
            .collect(Collectors.toSet()));
  }
}
