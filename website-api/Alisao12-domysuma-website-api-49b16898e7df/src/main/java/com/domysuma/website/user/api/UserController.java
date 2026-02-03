package com.domysuma.website.user.api;

import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.user.UserTypeStorage;
import com.domysuma.website.user.data.dto.request.UserUpdate;
import com.domysuma.website.user.data.enums.UserType;
import com.domysuma.website.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User")
@RestController
@RequestMapping(path = "api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @GetMapping("me")
    public ApiResponse me() {
        UserTypeStorage.setUserType(UserType.USER);
        return ApiResponse.ok(userService.getProfile());
    }

    @PutMapping("me")
    public ApiResponse updateMe(@RequestBody UserUpdate request) {
        UserTypeStorage.setUserType(UserType.USER);
        userService.updateUser(request);
        return ApiResponse.successMessage("User updated successfully");
    }
}
