package com.controlpet.repository;

import com.controlpet.model.AvaliacaoRelatorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // Importe para este método

import java.util.Optional;

@Repository
public interface AvaliacaoRelatorioRepository extends JpaRepository<AvaliacaoRelatorio, Integer> {
    Optional<AvaliacaoRelatorio> findByRelatorioId(Integer relatorioId);
    boolean existsByRelatorioId(Integer relatorioId);

    // NOVO MÉTODO: Deleta todas as AvaliacaoRelatorio por relatorioId
    @Transactional
    void deleteByRelatorioId(Integer relatorioId);
}