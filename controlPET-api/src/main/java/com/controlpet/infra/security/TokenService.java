package com.controlpet.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.controlpet.model.Usuario;
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
                    .withClaim("id", user.getId()) // Adiciona o ID do usuário
                    .withClaim("nome", user.getNome()) // Adiciona o nome do usuário
                    .withExpiresAt(this.generateExpirationDate())
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception){
            throw new RuntimeException("Error while authenticating");
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

    // Novo método para extrair informações do token
    public Usuario getUserFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var decoded = JWT.require(algorithm)
                    .withIssuer("login-auth-api")
                    .build()
                    .verify(token);
            
            Usuario user = new Usuario();
            user.setId(decoded.getClaim("id").asInt());
            user.setEmail(decoded.getSubject());
            user.setNome(decoded.getClaim("nome").asString());
            
            return user;
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    private Instant generateExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}