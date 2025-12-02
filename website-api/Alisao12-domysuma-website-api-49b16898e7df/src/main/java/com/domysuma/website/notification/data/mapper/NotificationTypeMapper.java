package com.domysuma.website.notification.data.mapper;

import com.domysuma.website.notification.data.dto.NotificationTypeCreate;
import com.domysuma.website.notification.model.NotificationType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationTypeMapper {
    NotificationType createToModel(NotificationTypeCreate create);
}
