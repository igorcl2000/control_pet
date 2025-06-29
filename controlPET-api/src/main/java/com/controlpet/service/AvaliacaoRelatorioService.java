package com.controlpet.service;

import com.controlpet.dto.AvaliacaoRelatorioRequest;
import com.controlpet.dto.AvaliacaoRelatorioResponse;
import com.controlpet.model.AvaliacaoRelatorio;
import com.controlpet.model.Relatorio;
import com.controlpet.repository.AvaliacaoRelatorioRepository;
import com.controlpet.repository.RelatorioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoRelatorioService {

    @Autowired
    private AvaliacaoRelatorioRepository avaliacaoRelatorioRepository;

    @Autowired
    private RelatorioRepository relatorioRepository;

    @Transactional
    public AvaliacaoRelatorioResponse criarAvaliacao(AvaliacaoRelatorioRequest request) {
        Relatorio relatorio = relatorioRepository.findById(request.getRelatorioId())
                .orElseThrow(() -> new EntityNotFoundException("Relatório não encontrado com ID: " + request.getRelatorioId()));

        if (avaliacaoRelatorioRepository.existsByRelatorioId(relatorio.getId())) {
            throw new IllegalArgumentException("Já existe uma avaliação para o relatório com ID: " + relatorio.getId());
        }

        AvaliacaoRelatorio avaliacao = new AvaliacaoRelatorio();
        avaliacao.setRelatorio(relatorio);
        avaliacao.setCargaHoraria(request.getCargaHoraria());
        avaliacao.setInteresseAtividades(request.getInteresseAtividades());
        avaliacao.setHabilidadesDesenvolvidas(request.getHabilidadesDesenvolvidas());
        avaliacao.setOutrasInformacoes(request.getOutrasInformacoes());

        AvaliacaoRelatorio savedAvaliacao = avaliacaoRelatorioRepository.save(avaliacao);
        return convertToResponse(savedAvaliacao);
    }

    public List<AvaliacaoRelatorioResponse> buscarTodasAvaliacoes() {
        return avaliacaoRelatorioRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public AvaliacaoRelatorioResponse buscarAvaliacaoPorId(Integer id) {
        AvaliacaoRelatorio avaliacao = avaliacaoRelatorioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação de relatório não encontrada com ID: " + id));
        return convertToResponse(avaliacao);
    }

    public AvaliacaoRelatorioResponse buscarAvaliacaoPorRelatorioId(Integer relatorioId) {
        AvaliacaoRelatorio avaliacao = avaliacaoRelatorioRepository.findByRelatorioId(relatorioId)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada para o relatório com ID: " + relatorioId));
        return convertToResponse(avaliacao);
    }

    @Transactional
    public AvaliacaoRelatorioResponse atualizarAvaliacao(Integer id, AvaliacaoRelatorioRequest request) {
        AvaliacaoRelatorio avaliacao = avaliacaoRelatorioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação de relatório não encontrada com ID: " + id));

        // Você pode adicionar uma verificação se o relatorioId na request é diferente do associado,
        // mas para um OneToOne com unique=true, geralmente não se muda o relatório associado após a criação.
        // Se precisar, adicione a lógica para atualizar o relatório, mas com cuidado para não quebrar a unicidade.

        avaliacao.setCargaHoraria(request.getCargaHoraria());
        avaliacao.setInteresseAtividades(request.getInteresseAtividades());
        avaliacao.setHabilidadesDesenvolvidas(request.getHabilidadesDesenvolvidas());
        avaliacao.setOutrasInformacoes(request.getOutrasInformacoes());

        AvaliacaoRelatorio updatedAvaliacao = avaliacaoRelatorioRepository.save(avaliacao);
        return convertToResponse(updatedAvaliacao);
    }

    @Transactional
    public void deletarAvaliacao(Integer id) {
        if (!avaliacaoRelatorioRepository.existsById(id)) {
            throw new EntityNotFoundException("Avaliação de relatório não encontrada com ID: " + id);
        }
        avaliacaoRelatorioRepository.deleteById(id);
    }

    private AvaliacaoRelatorioResponse convertToResponse(AvaliacaoRelatorio avaliacao) {
        AvaliacaoRelatorioResponse response = new AvaliacaoRelatorioResponse();
        response.setId(avaliacao.getId());
        response.setRelatorioId(avaliacao.getRelatorio().getId());
        response.setTipoRelatorio(avaliacao.getRelatorio().getTipoRelatorio()); // Pega o tipo do relatório associado
        response.setCargaHoraria(avaliacao.getCargaHoraria());
        response.setInteresseAtividades(avaliacao.getInteresseAtividades());
        response.setHabilidadesDesenvolvidas(avaliacao.getHabilidadesDesenvolvidas());
        response.setOutrasInformacoes(avaliacao.getOutrasInformacoes());
        response.setCriadoEm(avaliacao.getCriadoEm());
        response.setAtualizadoEm(avaliacao.getAtualizadoEm());
        return response;
    }
}