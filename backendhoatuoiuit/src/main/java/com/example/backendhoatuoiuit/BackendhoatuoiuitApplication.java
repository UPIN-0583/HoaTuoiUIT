package com.example.backendhoatuoiuit;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendhoatuoiuitApplication {

	public static void main(String[] args) {
		if (System.getenv("RENDER") == null) {
			try {
				Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
				dotenv.entries().forEach(entry ->
						System.setProperty(entry.getKey(), entry.getValue())
				);
			} catch (Exception e) {
				System.out.println("Warning: .env not found (probably production environment)");
			}
		}

		SpringApplication.run(BackendhoatuoiuitApplication.class, args);
	}

}
