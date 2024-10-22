package dev.prometheus.grouping.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.annotation.PostConstruct;
import org.springframework.util.StringUtils;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey key;

    private static final long EXPIRATION_TIME = 86400000;

    @PostConstruct
    public void init() {
        if (!StringUtils.hasText(secretKey)) {
            throw new IllegalStateException("JWT secret key is not configured");
        }
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String validateTokenAndGetEmail(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            System.out.println("JWT Validation Error: " + e.getMessage());
            throw e;
        }
    }
}