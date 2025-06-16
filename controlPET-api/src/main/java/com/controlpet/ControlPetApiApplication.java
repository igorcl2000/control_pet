package com.controlpet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.controlpet.repository")
@EntityScan(basePackages = "com.controlpet.model")
public class ControlPetApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ControlPetApiApplication.class, args);
    }
}