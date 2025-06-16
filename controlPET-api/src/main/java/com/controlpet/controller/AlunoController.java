package com.controlpet.controller;

import com.controlpet.dto.AlunoDTO;
import com.controlpet.model.Aluno;
import com.controlpet.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    public ResponseEntity<Aluno> criarAluno(@Valid @RequestBody AlunoDTO alunoDTO) {
        Aluno aluno = alunoService.criarAluno(alunoDTO);
        return new ResponseEntity<>(aluno, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Aluno>> listarAlunos() {
        List<Aluno> alunos = alunoService.listarTodos();
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarAlunoPorId(@PathVariable Integer id) {
        Aluno aluno = alunoService.buscarPorId(id);
        return ResponseEntity.ok(aluno);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aluno> atualizarAluno(
            @PathVariable Integer id,
            @Valid @RequestBody AlunoDTO alunoDTO) {
        Aluno alunoAtualizado = alunoService.atualizarAluno(id, alunoDTO);
        return ResponseEntity.ok(alunoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAluno(@PathVariable Integer id) {
        alunoService.deletarAluno(id);
        return ResponseEntity.noContent().build();
    }
}