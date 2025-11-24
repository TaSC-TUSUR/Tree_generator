package ru.tusur.asu.tasc.tree_generator_api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ru.tusur.asu.tasc.tree_generator_api.exception.JwtValidationException;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String createToken(String appId) {
        return Jwts.builder()
                .setSubject(appId)
                .signWith(key)
                .compact();
    }

    public String extractAppId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();

        } catch (ExpiredJwtException ex) {
            throw new JwtValidationException("Token expired", HttpStatus.UNAUTHORIZED);
        } catch (UnsupportedJwtException ex) {
            throw new JwtValidationException("Unsupported token", HttpStatus.BAD_REQUEST);
        } catch (MalformedJwtException ex) {
            throw new JwtValidationException("Invalid token", HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException ex) {
            throw new JwtValidationException("Token missing or empty", HttpStatus.BAD_REQUEST);
        }
    }
}

