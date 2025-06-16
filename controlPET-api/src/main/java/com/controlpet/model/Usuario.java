package com.controlpet.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

import com.controlpet.model.enums.TipoUsuario;

@Entity
@Table(name = "usuarios")
@Getter @Setter
@NoArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 100)
    private String nome;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('aluno', 'orientador') DEFAULT 'aluno'")
    private TipoUsuario tipo = TipoUsuario.aluno; // Valor padrão
    
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



	public String getNome() {
		return nome;
	}



	public void setNome(String nome) {
		this.nome = nome;
	}



	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}



	public String getSenhaHash() {
		return senhaHash;
	}



	public void setSenhaHash(String senhaHash) {
		this.senhaHash = senhaHash;
	}



	public TipoUsuario getTipo() {
		return tipo;
	}



	public void setTipo(TipoUsuario tipo) {
		this.tipo = tipo;
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