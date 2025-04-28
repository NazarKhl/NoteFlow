package com.project.java;
import com.project.java.auth.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
public class JavaApplication {
	public static void main(String[] args) {
		SpringApplication.run(JavaApplication.class, args);
	}
}
