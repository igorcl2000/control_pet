package com.controlpet.controller;

import com.controlpet.dto.RelatorioDTO;
import com.controlpet.dto.RelatorioResponseDTO;
import com.controlpet.model.Relatorio;
import com.controlpet.service.RelatorioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @PostMapping
    public ResponseEntity<RelatorioResponseDTO> criarRelatorio(@Valid @RequestBody RelatorioDTO relatorioDTO) {
        Relatorio relatorio = relatorioService.criarRelatorio(relatorioDTO);
        return new ResponseEntity<>(new RelatorioResponseDTO(relatorio), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RelatorioResponseDTO>> listarRelatorios() {
        List<Relatorio> relatorios = relatorioService.listarTodos();
        List<RelatorioResponseDTO> response = relatorios.stream()
            .map(RelatorioResponseDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RelatorioResponseDTO> buscarRelatorioPorId(@PathVariable Integer id) {
        Relatorio relatorio = relatorioService.buscarPorId(id);
        RelatorioResponseDTO response = new RelatorioResponseDTO(relatorio);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RelatorioResponseDTO> atualizarRelatorio(
            @PathVariable Integer id,
            @Valid @RequestBody RelatorioDTO relatorioDTO) {
        Relatorio relatorioAtualizado = relatorioService.atualizarRelatorio(id, relatorioDTO);
        return ResponseEntity.ok(new RelatorioResponseDTO(relatorioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRelatorio(@PathVariable Integer id) {
        relatorioService.deletarRelatorio(id);
        return ResponseEntity.noContent().build();
    }
}