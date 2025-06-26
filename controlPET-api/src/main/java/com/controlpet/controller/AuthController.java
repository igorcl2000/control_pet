package com.controlpet.controller;

import com.controlpet.dto.LoginRequest;
import com.controlpet.dto.LoginResponse;
import com.controlpet.dto.RegisterRequestDTO;
import com.controlpet.dto.UserInfoDTO;
import com.controlpet.dto.ChangePasswordRequest; // Importe o novo DTO
import com.controlpet.model.Usuario;
import com.controlpet.model.enums.TipoUsuario;
import com.controlpet.repository.UsuarioRepository;
import com.controlpet.infra.security.TokenService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Importe HttpStatus para códigos de resposta melhores
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
        Usuario user = tokenService.getUserFromToken(token); // Assume que este método retorna um Usuario válido do token

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        // Busca informações atualizadas do banco, especialmente se o token não contiver todos os dados (ex: senhaHash)
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

        // 1. Valida o cabeçalho Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Não Autorizado
        }

        String token = authHeader.substring(7);
        Usuario authenticatedUserFromToken = tokenService.getUserFromToken(token);

        // 2. Verifica se o usuário foi autenticado com sucesso a partir do token
        if (authenticatedUserFromToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Token inválido ou expirado
        }

        // 3. Recupera a entidade completa do usuário do banco de dados
        // Isso é crucial porque o objeto Usuario retornado pelo tokenService.getUserFromToken
        // pode não conter o `senhaHash` ou outros dados necessários para comparação.
        Optional<Usuario> userOptional = repository.findByEmail(authenticatedUserFromToken.getEmail());

        if (userOptional.isEmpty()) {
            // Isso não deveria acontecer se o tokenService.getUserFromToken já retornou um usuário válido,
            // mas é uma boa salvaguarda caso o usuário tenha sido deletado após a emissão do token.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario user = userOptional.get();

        // 4. Verifica a senha atual
        if (!passwordEncoder.matches(request.currentPassword(), user.getSenhaHash())) {
            // Retorna 400 Bad Request se a senha atual fornecida estiver incorreta.
            // O frontend tratará isso como um erro e exibirá a mensagem adequada.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // 5. Criptografa e atualiza a nova senha
        String newHashedPassword = passwordEncoder.encode(request.newPassword());
        user.setSenhaHash(newHashedPassword);

        // 6. Salva o usuário atualizado no banco de dados
        repository.save(user);

        // 7. Retorna resposta de sucesso (200 OK)
        return ResponseEntity.ok().build();
    }
}