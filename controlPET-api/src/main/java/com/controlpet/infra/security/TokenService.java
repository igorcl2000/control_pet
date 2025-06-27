package com.controlpet.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.controlpet.model.Usuario;
import com.controlpet.model.enums.TipoUsuario; // Importe o enum TipoUsuario
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(Usuario user){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                    .withIssuer("login-auth-api")
                    .withSubject(user.getEmail())
                    .withClaim("id", user.getId())
                    .withClaim("nome", user.getNome())
                    // ADICIONAR O TIPO DO USUÁRIO COMO UM CLAIM NO TOKEN
                    .withClaim("tipo", user.getTipo().name()) // Converte o enum para String
                    .withExpiresAt(this.generateExpirationDate())
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception){
            throw new RuntimeException("Error while authenticating", exception); // Adicionado 'exception' para melhor rastreamento
        }
    }

    public String validateToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("login-auth-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    // Método para extrair informações do token, incluindo o tipo de usuário
    public Usuario getUserFromToken(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var decoded = JWT.require(algorithm)
                    .withIssuer("login-auth-api")
                    .build()
                    .verify(token);

            Usuario user = new Usuario();
            user.setId(decoded.getClaim("id").asInt()); // CORREÇÃO AQUI: Alterado para asInt()
            user.setEmail(decoded.getSubject());
            user.setNome(decoded.getClaim("nome").asString());
            // EXTRAIR O TIPO DO USUÁRIO DO CLAIM E CONVERTER DE VOLTA PARA ENUM
            String tipoString = decoded.getClaim("tipo").asString();
            if (tipoString != null && !tipoString.isEmpty()) {
                user.setTipo(TipoUsuario.valueOf(tipoString));
            }

            return user;
        } catch (JWTVerificationException exception) {
            // Log do erro pode ser útil para depuração
            // logger.error("Erro ao validar token ou ao extrair claims: {}", exception.getMessage());
            return null;
        } catch (IllegalArgumentException e) {
            // Captura erro se o valor do 'tipo' no token não corresponder a um enum válido
            // logger.error("Valor do tipo de usuário no token inválido: {}", e.getMessage());
            return null;
        }
    }

    private Instant generateExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
