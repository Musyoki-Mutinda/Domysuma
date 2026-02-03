package com.domysuma.website.user.data.mapper;

import com.domysuma.website.auth.data.AuthResponse;
import com.domysuma.website.user.data.dto.request.UserCreate;
import com.domysuma.website.user.data.dto.request.UserUpdate;
import com.domysuma.website.user.data.dto.response.UserJwtResponse;
import com.domysuma.website.user.data.dto.response.UserResponse;
import com.domysuma.website.user.model.User;
import org.mapstruct.*;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    @Mapping(target = "username", source = "email")
    @Mapping(target = "fullName", expression = "java(userCreate.getFirstName() + \" \" + userCreate.getLastName())")
    User createRequestToModel(UserCreate userCreate);

    UserResponse modelToResponse(User user);

    @Mapping(target = "role", expression = "java(user.getRoles() != null && !user.getRoles().isEmpty() ? user.getRoles().iterator().next() : \"USER\")")
    AuthResponse modelToAuthResponse(User user);

    UserJwtResponse modelToJwtUserResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserToModel(UserUpdate userUpdate, @MappingTarget User user);
}
