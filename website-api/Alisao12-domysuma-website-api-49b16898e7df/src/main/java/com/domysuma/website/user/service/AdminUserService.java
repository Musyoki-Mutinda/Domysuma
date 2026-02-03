package com.domysuma.website.user.service;

import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.util.RandomUtil;
import com.domysuma.website.user.data.dto.request.UserCreate;
import com.domysuma.website.user.data.mapper.AdminUserMapper;
import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.repository.AdminUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {
    private final AdminUserRepo adminUserRepo;
    private final AdminUserMapper adminUserMapper;
    private final PasswordEncoder passwordEncoder;

    public void createUser(UserCreate request) {
        if (adminUserRepo.findByUsername(request.getUsername()).isPresent()) {
            throw APIException.conflict("Username exists!");
        }

        var user = adminUserMapper.createRequestToModel(request);
        user.setCode(RandomUtil.getRandomAlphanumeric(16));
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        adminUserRepo.save(user);
    }

    public void createDefaultUser() {
        var admin = new AdminUser();

        admin.setFirstName("Super");
        admin.setLastName("Admin");
        admin.setCode("SUPER_ADMIN");
        admin.setEmail("isaboke@gmail.com");
        admin.setPhoneNumber("0721765229");
        admin.setUsername("super");
        admin.setPassword(passwordEncoder.encode("12345678"));

        if (adminUserRepo.findByUsername("super").isEmpty()) {
            adminUserRepo.save(admin);
        }
    }
}
