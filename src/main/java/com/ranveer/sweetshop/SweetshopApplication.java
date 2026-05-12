package com.ranveer.sweetshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.ranveer.sweetshop.repository.UserRepository;
import com.ranveer.sweetshop.repository.SweetRepository;
import com.ranveer.sweetshop.model.User;
import com.ranveer.sweetshop.model.Role;
import com.ranveer.sweetshop.model.Sweet;

@SpringBootApplication
@Slf4j
@RequiredArgsConstructor
public class SweetshopApplication {

    public static void main(String[] args) {
        SpringApplication.run(SweetshopApplication.class, args);
    }

    /* =========================
       Create Default Admin User
    ========================= */

    @Bean
    CommandLineRunner createAdmin(UserRepository repo, PasswordEncoder encoder) {

        return args -> {

            if (repo.findByUsername("admin").isEmpty()) {

                User admin = User.builder()
                        .username("admin")
                        .password(encoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();

                repo.save(admin);

                log.info("Default admin user created: username=admin");
            }
        };
    }

    @Bean
    CommandLineRunner seedSweets(SweetRepository repo) {

        return args -> {

            if (repo.count() > 0) {
                return;
            }

            repo.save(Sweet.builder().name("Kaju Katli").category("Dry Fruit Sweets").price(80).quantity(25).build());
            repo.save(Sweet.builder().name("Gulab Jamun").category("Traditional Sweets").price(40).quantity(40).build());
            repo.save(Sweet.builder().name("Rasgulla").category("Milk Sweets").price(40).quantity(35).build());
            repo.save(Sweet.builder().name("Jalebi").category("Traditional Sweets").price(35).quantity(50).build());
            repo.save(Sweet.builder().name("Rasmalai").category("Milk Sweets").price(70).quantity(20).build());
            repo.save(Sweet.builder().name("Ladoo").category("Festival Specials").price(45).quantity(45).build());
            repo.save(Sweet.builder().name("Barfi").category("Milk Sweets").price(60).quantity(30).build());
            repo.save(Sweet.builder().name("Soan Papdi").category("Festival Specials").price(55).quantity(28).build());

            log.info("Sample sweets seeded for local development");
        };
    }
}
