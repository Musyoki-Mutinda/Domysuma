package com.domysuma.website;

import com.domysuma.website.user.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminUserStartupRunner implements CommandLineRunner {
    final
    AdminUserService adminUserService;

    public AdminUserStartupRunner(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @Override
    public void run(String... args) {
        adminUserService.createDefaultUser();
    }
}
