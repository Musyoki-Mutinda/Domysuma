package com.domysuma.website.design.repository;

import com.domysuma.website.design.model.Design;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface DesignRepo extends JpaRepository<Design, Long>, JpaSpecificationExecutor<Design> {
    Optional<Design> findByCode(String planNumber);

    Optional<Design> findBySlug(String slug);

    List<Design> findTop10BySlugIsNull();
}
