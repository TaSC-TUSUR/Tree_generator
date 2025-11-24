package ru.tusur.asu.tasc.tree_generator_api.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.AuthRequest;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.AuthResponse;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.RegisterRequest;
import ru.tusur.asu.tasc.tree_generator_api.entity.ApiUser;
import ru.tusur.asu.tasc.tree_generator_api.repository.ApiUserRepository;
import ru.tusur.asu.tasc.tree_generator_api.security.JwtService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ApiUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {

        ApiUser user = ApiUser.builder()
                .login(req.getLogin())
                .email(req.getEmail())
                .fullName(req.getFullName())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(jwtService.createToken(user.getLogin())));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {

        ApiUser user = userRepository.findByLogin(req.getLogin())
                .orElseThrow(() -> new RuntimeException("Invalid login"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return ResponseEntity.ok(new AuthResponse(jwtService.createToken(user.getLogin())));
    }
}
