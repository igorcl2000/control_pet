package com.controlpet.service;

import com.controlpet.dto.AlunoDTO;
import com.controlpet.model.Aluno;
import com.controlpet.model.Usuario;
import com.controlpet.repository.AlunoRepository;
import com.controlpet.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;

    public AlunoService(AlunoRepository alunoRepository, 
                       UsuarioRepository usuarioRepository) {
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
    }
    
    	// Verificar se usuário já tem aluno associado
    private void verificarUsuarioJaPossuiAluno(Integer usuarioId) {
        if (alunoRepository.existsByUsuarioId(usuarioId)) {
            throw new IllegalArgumentException("Usuário já possui um aluno associado");
        }
    }

    @Transactional
    public Aluno criarAluno(AlunoDTO alunoDTO) {
        validarUsuario(alunoDTO.usuarioId());
        verificarUsuarioJaPossuiAluno(alunoDTO.usuarioId());
        
        Aluno aluno = new Aluno();
        mapearDTOParaEntidade(alunoDTO, aluno);
        
        return alunoRepository.save(aluno);
    }

    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    public Aluno buscarPorId(Integer id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
    }

    @Transactional
    public Aluno atualizarAluno(Integer id, AlunoDTO alunoDTO) {
        Aluno alunoExistente = alunoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
        
        validarUsuario(alunoDTO.usuarioId());
        mapearDTOParaEntidade(alunoDTO, alunoExistente);
        
        return alunoRepository.save(alunoExistente);
    }

    @Transactional
    public void deletarAluno(Integer id) {
        if (!alunoRepository.existsById(id)) {
            throw new IllegalArgumentException("Aluno não encontrado");
        }
        alunoRepository.deleteById(id);
    }

    private void validarUsuario(Integer usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
    }

    private void mapearDTOParaEntidade(AlunoDTO dto, Aluno aluno) {
        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        aluno.setUsuario(usuario);
        aluno.setIdade(dto.idade());
        aluno.setPeriodoAno(dto.periodoAno());
        aluno.setEditalIngresso(dto.editalIngresso());
        aluno.setTipoEstudante(dto.tipoEstudante());
        aluno.setCurso(dto.curso());
    }
}