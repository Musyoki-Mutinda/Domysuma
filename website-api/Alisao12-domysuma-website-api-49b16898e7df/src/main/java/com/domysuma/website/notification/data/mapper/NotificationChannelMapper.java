package com.domysuma.website.notification.data.mapper;

import com.domysuma.website.notification.data.dto.NotificationChannelCreate;
import com.domysuma.website.notification.model.NotificationChannel;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationChannelMapper {
    NotificationChannel createToModel(NotificationChannelCreate create);
}
