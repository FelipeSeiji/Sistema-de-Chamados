package com.tvdiario.sistema_chamado.domain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SistemaChamadoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SistemaChamadoApplication.class, args);
	}

}
