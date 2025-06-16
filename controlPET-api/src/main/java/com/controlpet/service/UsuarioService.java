package com.controlpet.service;

import com.controlpet.dto.UsuarioDTO;
import com.controlpet.model.Usuario;
import com.controlpet.model.enums.TipoUsuario;
import com.controlpet.repository.AlunoRepository;
import com.controlpet.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, 
                         PasswordEncoder passwordEncoder, AlunoRepository alunoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario criarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.existsByEmail(usuarioDTO.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioDTO.nome());
        usuario.setEmail(usuarioDTO.email());
        usuario.setSenhaHash(passwordEncoder.encode(usuarioDTO.senha()));
        usuario.setTipo(TipoUsuario.aluno);
        
        return usuarioRepository.save(usuario);
    }
}