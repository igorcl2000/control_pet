package com.controlpet.controller;

import com.controlpet.dto.LoginRequest;
import com.controlpet.dto.LoginResponse;
import com.controlpet.dto.RegisterRequestDTO;
import com.controlpet.dto.UserInfoDTO;
import com.controlpet.dto.ChangePasswordRequest;
import com.controlpet.model.Usuario;
import com.controlpet.model.enums.TipoUsuario;
import com.controlpet.repository.UsuarioRepository;
import com.controlpet.infra.security.TokenService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

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
            return ResponseEntity.ok(new LoginResponse(user.getNome(),user.getTipo(), token));
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
            // É recomendado normalizar o tipo de entrada para maiúsculas antes de usar valueOf()
            // para evitar problemas de case-sensitivity se o enum usar maiúsculas
            // e a entrada vier em minúsculas (ou vice-versa).
            // Com seu enum sendo minúsculas (aluno, orientador), se a entrada for "ORIENTADOR",
            // TipoUsuario.valueOf() falhará.
            // Opção 1 (se o enum for SEMPRE minúsculas): newUser.setTipo(TipoUsuario.valueOf(body.tipo().toLowerCase()));
            // Opção 2 (se o enum puder ter casos diferentes, mas você quer garantir compatibilidade):
            // Considerar uma função de mapeamento ou um método no DTO para normalizar o tipo.
            // Por enquanto, mantemos como está, assumindo que `body.tipo()` vem em minúsculas.
            newUser.setTipo(TipoUsuario.valueOf(body.tipo()));
            this.repository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new LoginResponse(newUser.getNome(),newUser.getTipo(), token));
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

    /**
     * Endpoint para alterar a senha do usuário autenticado.
     * Requer o token JWT no cabeçalho Authorization e um corpo de requisição
     * com a senha atual e a nova senha.
     *
     * @param authHeader O cabeçalho de autorização contendo o token Bearer.
     * @param request    Objeto ChangePasswordRequest com currentPassword e newPassword.
     * @return ResponseEntity indicando sucesso (200 OK) ou falha (401 Unauthorized, 400 Bad Request).
     */
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChangePasswordRequest request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        Usuario authenticatedUserFromToken = tokenService.getUserFromToken(token);

        if (authenticatedUserFromToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Usuario> userOptional = repository.findByEmail(authenticatedUserFromToken.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario user = userOptional.get();

        if (!passwordEncoder.matches(request.currentPassword(), user.getSenhaHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String newHashedPassword = passwordEncoder.encode(request.newPassword());
        user.setSenhaHash(newHashedPassword);

        repository.save(user);

        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para resetar a senha de um usuário específico para um valor padrão.
     * Apenas usuários com o tipo 'orientador' podem executar esta operação.
     *
     * @param authHeader O cabeçalho de autorização contendo o token Bearer do usuário que solicita o reset.
     * @param userId O ID do usuário cuja senha será resetada.
     * @return ResponseEntity indicando sucesso (200 OK), não autorizado (401 Unauthorized),
     * proibido (403 Forbidden) ou não encontrado (404 Not Found).
     */
    @PutMapping("/reset-password/{userId}")
    public ResponseEntity<Void> resetPassword(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer userId) {

        logger.info("Tentativa de resetar senha para userId: {}", userId);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Requisição de reset de senha sem cabeçalho Authorization válido.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        Usuario authenticatedUser = tokenService.getUserFromToken(token);

        if (authenticatedUser == null) {
            logger.warn("Token inválido ou expirado. Usuário autenticado é nulo.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else {
            logger.info("Usuário autenticado: email='{}', tipo='{}'",
                    authenticatedUser.getEmail(), authenticatedUser.getTipo());
        }

        // CORREÇÃO: Usando TipoUsuario.orientador para corresponder ao case do enum
        if (authenticatedUser.getTipo() != TipoUsuario.orientador) {
            logger.warn("Usuário '{}' (Tipo: {}) tentou resetar senha, mas não é orientador.",
                    authenticatedUser.getEmail(), authenticatedUser.getTipo());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Usuario> targetUserOptional = repository.findById(userId);

        if (targetUserOptional.isEmpty()) {
            logger.warn("Tentativa de resetar senha para userId '{}', mas usuário não encontrado.", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Usuario targetUser = targetUserOptional.get();
        logger.info("Resetando senha para usuário alvo: email='{}'", targetUser.getEmail());

        String defaultPassword = "Senha123";
        String newHashedPassword = passwordEncoder.encode(defaultPassword);
        targetUser.setSenhaHash(newHashedPassword);

        repository.save(targetUser);
        logger.info("Senha do usuário '{}' resetada com sucesso.", targetUser.getEmail());

        return ResponseEntity.ok().build();
    }
}
