package com.controlpet.controller;

import com.controlpet.dto.LoginRequest;
import com.controlpet.dto.LoginResponse;
import com.controlpet.dto.RegisterRequestDTO;
import com.controlpet.dto.UserInfoDTO;
import com.controlpet.model.Usuario;
import com.controlpet.repository.UsuarioRepository;
import com.controlpet.infra.security.TokenService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    @Autowired
    private UsuarioRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest body) {
        Usuario user = this.repository.findByEmail(body.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (passwordEncoder.matches(body.senha(), user.getSenhaHash())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new LoginResponse(user.getNome(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequestDTO body) {
        Optional<Usuario> user = this.repository.findByEmail(body.email());

        if (user.isEmpty()) {
            Usuario newUser = new Usuario();
            newUser.setSenhaHash(passwordEncoder.encode(body.senha()));
            newUser.setEmail(body.email());
            newUser.setNome(body.nome());
            this.repository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new LoginResponse(newUser.getNome(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getMe(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        Usuario user = tokenService.getUserFromToken(token);
        
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        // Busca informações atualizadas do banco
        Optional<Usuario> dbUser = repository.findByEmail(user.getEmail());
        if (dbUser.isPresent()) {
            user = dbUser.get();
        }

        UserInfoDTO userInfo = new UserInfoDTO(
            user.getId(),
            user.getNome(),
            user.getEmail(),
            user.getTipo()
        );

        return ResponseEntity.ok(userInfo);
    }
}