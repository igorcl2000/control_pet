package com.controlpet.repository;

import com.controlpet.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Integer> {
    boolean existsByUsuarioId(Integer usuarioId);
    Aluno findByUsuarioId(Integer usuarioId);
}