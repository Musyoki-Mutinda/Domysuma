package com.domysuma.website.user.service;

import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.user.UserTypeStorage;
import com.domysuma.website.user.data.enums.UserType;
import com.domysuma.website.user.repository.AdminUserRepo;
import com.domysuma.website.user.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.lang.String.format;

@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepo userRepo;
    private final AdminUserRepo adminUserRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("loadUserByUsername called for: " + username);
        var userType = UserTypeStorage.getUserType();
        System.out.println("UserType: " + userType);

        if (userType == null) {
            throw APIException.internalError("Unable to authenticate: user type could not be determined");
        }

        if (userType.equals(UserType.ADMIN)) {
            System.out.println("Loading admin user: " + username);
            return adminUserRepo
                    .findByUsername(username)
                    .orElseThrow(
                            () -> new UsernameNotFoundException(format("User with username - %s, not found", username)));
        } else if (userType.equals(UserType.USER)) {
            System.out.println("Loading user: " + username);
            return userRepo
                    .findByUsername(username)
                    .orElseThrow(
                            () -> new UsernameNotFoundException(format("User with username - %s, not found", username)));
        } else {
            throw APIException.internalError("Unable to authenticate: user type could not be determined");
        }
    }
}

