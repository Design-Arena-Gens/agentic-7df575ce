package com.cakeshop.config;

import com.cakeshop.entity.Role;
import com.cakeshop.entity.User;
import com.cakeshop.repository.UserRepository;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

  private static final Logger LOG = LoggerFactory.getLogger(DataInitializer.class);

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    if (!userRepository.existsByEmail("admin@cakeshop.com")) {
      User admin = new User();
      admin.setEmail("admin@cakeshop.com");
      admin.setFullName("Cake Shop Admin");
      admin.setPassword(passwordEncoder.encode("admin123"));
      admin.setRoles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER));
      userRepository.save(admin);
      LOG.info("Created default admin user: admin@cakeshop.com / admin123");
    }
  }
}
