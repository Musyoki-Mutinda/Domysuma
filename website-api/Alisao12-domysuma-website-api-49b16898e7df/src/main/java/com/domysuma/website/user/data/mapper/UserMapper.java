package com.domysuma.website.user.data.mapper;

import com.domysuma.website.auth.data.AuthResponse;
import com.domysuma.website.user.data.dto.request.UserCreate;
import com.domysuma.website.user.data.dto.request.UserUpdate;
import com.domysuma.website.user.data.dto.response.UserJwtResponse;
import com.domysuma.website.user.data.dto.response.UserResponse;
import com.domysuma.website.user.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    User createRequestToModel(UserCreate userCreate);

    UserResponse modelToResponse(User user);

    AuthResponse modelToAuthResponse(User user);

    UserJwtResponse modelToJwtUserResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserToModel(UserUpdate userUpdate, @MappingTarget User user);
}
