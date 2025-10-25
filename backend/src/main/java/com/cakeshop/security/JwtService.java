package com.cakeshop.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final Key signingKey;
  private final long expirationSeconds;

  public JwtService(
      @Value("${app.security.jwt.secret}") String jwtSecret,
      @Value("${app.security.jwt.expiration-seconds:3600}") long expirationSeconds) {
    this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    this.expirationSeconds = expirationSeconds;
  }

  public String generateToken(String subject) {
    Instant now = Instant.now();
    Instant expiration = now.plusSeconds(expirationSeconds);
    return Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(expiration))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public Optional<String> extractSubject(String token) {
    try {
      Claims claims = Jwts.parserBuilder()
          .setSigningKey(signingKey)
          .build()
          .parseClaimsJws(token)
          .getBody();
      return Optional.ofNullable(claims.getSubject());
    } catch (Exception e) {
      return Optional.empty();
    }
  }
}
