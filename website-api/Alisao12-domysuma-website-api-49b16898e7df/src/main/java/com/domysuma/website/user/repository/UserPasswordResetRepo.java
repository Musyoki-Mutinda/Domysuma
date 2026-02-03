package com.domysuma.website.user.repository;

import com.domysuma.website.user.model.User;
import com.domysuma.website.user.model.UserPasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UserPasswordResetRepo extends JpaRepository<UserPasswordReset, Long>, JpaSpecificationExecutor<UserPasswordReset> {
    Optional<UserPasswordReset> findFirstByUser(User user);
}
