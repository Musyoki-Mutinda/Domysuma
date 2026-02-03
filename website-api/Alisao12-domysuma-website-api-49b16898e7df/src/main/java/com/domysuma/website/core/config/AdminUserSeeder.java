package com.domysuma.website.config;

import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.repository.AdminUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminUserSeeder implements CommandLineRunner {

    private final AdminUserRepo adminUserRepo;
    private final PasswordEncoder passwordEncoder;  //Bcrypt

    @Override
    public void run(String... args) throws Exception {
        String email = "admin@example.com";
        String username = "admin";
        String rawPassword = "admin123";

        if (adminUserRepo.findByEmail(email).isEmpty()) {
            AdminUser admin = new AdminUser();
            admin.setUsername(username);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(rawPassword)); //Bcrypt
            adminUserRepo.save(admin);
            System.out.println("✅ Admin user created: " + email + " / " + rawPassword);
        } else {
            System.out.println("ℹ️ Admin already exists: " + email);
        }
    }
}
