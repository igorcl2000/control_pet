package com.controlpet.service;

import com.controlpet.dto.RelatorioDTO;
import com.controlpet.model.Aluno;
import com.controlpet.model.Relatorio;
import com.controlpet.repository.AlunoRepository;
import com.controlpet.repository.RelatorioRepository;
import com.controlpet.repository.AvaliacaoRelatorioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;
    private final AlunoRepository alunoRepository;
    private final AvaliacaoRelatorioRepository avaliacaoRelatorioRepository; // Injete este

    public RelatorioService(RelatorioRepository relatorioRepository,
                            AlunoRepository alunoRepository,
                            AvaliacaoRelatorioRepository avaliacaoRelatorioRepository) { // Adicione ao construtor
        this.relatorioRepository = relatorioRepository;
        this.alunoRepository = alunoRepository;
        this.avaliacaoRelatorioRepository = avaliacaoRelatorioRepository; // Inicialize
    }

    @Transactional
    public Relatorio criarRelatorio(RelatorioDTO relatorioDTO) {
        Aluno aluno = alunoRepository.findById(relatorioDTO.alunoId())
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        Relatorio relatorio = new Relatorio();
        relatorio.setAluno(aluno);
        relatorio.setTipoRelatorio(relatorioDTO.tipoRelatorio() != null ? 
                                 relatorioDTO.tipoRelatorio() : "Relatório Mensal");
        relatorio.setDataInicial(relatorioDTO.dataInicial());
        relatorio.setDataFinal(relatorioDTO.dataFinal());
        relatorio.setDataEnvio(relatorioDTO.dataEnvio());
        relatorio.setResumoAtividades(relatorioDTO.resumoAtividades());
        relatorio.setComentarios(relatorioDTO.comentarios());

        return relatorioRepository.save(relatorio);
    }

    public List<Relatorio> listarTodos() {
        return relatorioRepository.findAll();
    }

    public Relatorio buscarPorId(Integer id) {
        return relatorioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Relatório não encontrado"));
    }

    @Transactional
    public Relatorio atualizarRelatorio(Integer id, RelatorioDTO relatorioDTO) {
        Relatorio relatorioExistente = relatorioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Relatório não encontrado"));

        if (relatorioDTO.alunoId() != null) {
            Aluno aluno = alunoRepository.findById(relatorioDTO.alunoId())
                    .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
            relatorioExistente.setAluno(aluno);
        }

        if (relatorioDTO.tipoRelatorio() != null) {
            relatorioExistente.setTipoRelatorio(relatorioDTO.tipoRelatorio());
        }

        relatorioExistente.setDataInicial(relatorioDTO.dataInicial());
        relatorioExistente.setDataFinal(relatorioDTO.dataFinal());
        relatorioExistente.setDataEnvio(relatorioDTO.dataEnvio());
        relatorioExistente.setResumoAtividades(relatorioDTO.resumoAtividades());
        relatorioExistente.setComentarios(relatorioDTO.comentarios());

        return relatorioRepository.save(relatorioExistente);
    }

    @Transactional
    public void deletarRelatorio(Integer id) {
        if (!relatorioRepository.existsById(id)) {
            throw new IllegalArgumentException("Relatório não encontrado");
        }

        // NOVO PASSO: Primeiro, delete as avaliações de relatório associadas
        avaliacaoRelatorioRepository.deleteByRelatorioId(id);

        // Em seguida, delete o relatório
        relatorioRepository.deleteById(id);
    }
}