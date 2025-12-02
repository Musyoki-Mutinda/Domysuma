package com.domysuma.website.user.repository;

import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.model.AdminUserPasswordReset;
import com.domysuma.website.user.model.User;
import com.domysuma.website.user.model.UserPasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface AdminUserPasswordResetRepo extends JpaRepository<AdminUserPasswordReset, Long>, JpaSpecificationExecutor<AdminUserPasswordReset> {
    Optional<AdminUserPasswordReset> findFirstByUser(AdminUser user);
}
