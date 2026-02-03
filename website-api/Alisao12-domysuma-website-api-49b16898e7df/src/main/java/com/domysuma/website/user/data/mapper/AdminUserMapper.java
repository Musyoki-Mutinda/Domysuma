package com.domysuma.website.user.data.mapper;

import com.domysuma.website.auth.data.AuthResponse;
import com.domysuma.website.user.data.dto.request.UserCreate;
import com.domysuma.website.user.data.dto.response.UserJwtResponse;
import com.domysuma.website.user.data.dto.response.UserResponse;
import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdminUserMapper {
    AdminUser createRequestToModel(UserCreate userCreate);

    List<UserResponse> modelsToResponses(List<AdminUser> user);

    AuthResponse modelToAuthResponse(AdminUser user);

    UserJwtResponse modelToJwtUserResponse(AdminUser user);
}
