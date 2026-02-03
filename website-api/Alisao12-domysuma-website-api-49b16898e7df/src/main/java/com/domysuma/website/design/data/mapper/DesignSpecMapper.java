package com.domysuma.website.design.data.mapper;

import com.domysuma.website.design.data.dto.request.DesignSpecCreate;
import com.domysuma.website.design.model.DesignSpec;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DesignSpecMapper {
    DesignSpec toEntity(DesignSpecCreate designSpecCreate);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSpecsToModel(DesignSpecCreate designSpecUpdate, @MappingTarget DesignSpec designSpec);
}
