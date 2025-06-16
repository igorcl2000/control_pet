package com.controlpet.controller;

import com.controlpet.dto.UsuarioDTO;
import com.controlpet.model.Usuario;
import com.controlpet.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.criarUsuario(usuarioDTO);
        return new ResponseEntity<>(usuario, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<String> getUsuario(){
        return ResponseEntity.ok("sucesso!");
    }
}