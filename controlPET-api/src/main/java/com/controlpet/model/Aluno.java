package com.controlpet.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

import com.controlpet.model.enums.TipoEstudante;

@Entity
@Table(name = "alunos")
@Getter @Setter
public class Aluno {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;
    
    private Integer idade;
    
    @Column(name = "periodo_ano", length = 20)
    private String periodoAno;
    
    @Column(name = "edital_ingresso", length = 50)
    private String editalIngresso;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_estudante", columnDefinition = "ENUM('bolsista', 'voluntario')")
    private TipoEstudante tipoEstudante;
    
    @Column(length = 100)
    private String curso;
    
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
    
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm = LocalDateTime.now();
    
    

    public Integer getId() {
		return id;
	}



	public void setId(Integer id) {
		this.id = id;
	}



	public Usuario getUsuario() {
		return usuario;
	}



	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}



	public Integer getIdade() {
		return idade;
	}



	public void setIdade(Integer idade) {
		this.idade = idade;
	}



	public String getPeriodoAno() {
		return periodoAno;
	}



	public void setPeriodoAno(String periodoAno) {
		this.periodoAno = periodoAno;
	}



	public String getEditalIngresso() {
		return editalIngresso;
	}



	public void setEditalIngresso(String editalIngresso) {
		this.editalIngresso = editalIngresso;
	}



	public TipoEstudante getTipoEstudante() {
		return tipoEstudante;
	}



	public void setTipoEstudante(TipoEstudante tipoEstudante) {
		this.tipoEstudante = tipoEstudante;
	}



	public String getCurso() {
		return curso;
	}



	public void setCurso(String curso) {
		this.curso = curso;
	}



	public LocalDateTime getCriadoEm() {
		return criadoEm;
	}



	public void setCriadoEm(LocalDateTime criadoEm) {
		this.criadoEm = criadoEm;
	}



	public LocalDateTime getAtualizadoEm() {
		return atualizadoEm;
	}



	public void setAtualizadoEm(LocalDateTime atualizadoEm) {
		this.atualizadoEm = atualizadoEm;
	}



	@PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}