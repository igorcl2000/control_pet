package com.controlpet.controller;

import com.controlpet.dto.AvaliacaoRelatorioRequest;
import com.controlpet.dto.AvaliacaoRelatorioResponse;
import com.controlpet.service.AvaliacaoRelatorioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes-relatorio")
public class AvaliacaoRelatorioController {

    @Autowired
    private AvaliacaoRelatorioService avaliacaoRelatorioService;

    @PostMapping
    public ResponseEntity<AvaliacaoRelatorioResponse> criarAvaliacao(@Valid @RequestBody AvaliacaoRelatorioRequest request) {
        AvaliacaoRelatorioResponse response = avaliacaoRelatorioService.criarAvaliacao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoRelatorioResponse>> buscarTodasAvaliacoes() {
        List<AvaliacaoRelatorioResponse> avaliacoes = avaliacaoRelatorioService.buscarTodasAvaliacoes();
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoRelatorioResponse> buscarAvaliacaoPorId(@PathVariable Integer id) {
        AvaliacaoRelatorioResponse avaliacao = avaliacaoRelatorioService.buscarAvaliacaoPorId(id);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/relatorio/{relatorioId}")
    public ResponseEntity<AvaliacaoRelatorioResponse> buscarAvaliacaoPorRelatorioId(@PathVariable Integer relatorioId) {
        AvaliacaoRelatorioResponse avaliacao = avaliacaoRelatorioService.buscarAvaliacaoPorRelatorioId(relatorioId);
        return ResponseEntity.ok(avaliacao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoRelatorioResponse> atualizarAvaliacao(@PathVariable Integer id, @Valid @RequestBody AvaliacaoRelatorioRequest request) {
        AvaliacaoRelatorioResponse response = avaliacaoRelatorioService.atualizarAvaliacao(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Integer id) {
        avaliacaoRelatorioService.deletarAvaliacao(id);
        return ResponseEntity.noContent().build();
    }
}