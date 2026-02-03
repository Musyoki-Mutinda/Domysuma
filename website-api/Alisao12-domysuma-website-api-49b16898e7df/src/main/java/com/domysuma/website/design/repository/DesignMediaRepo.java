package com.domysuma.website.design.repository;

import com.domysuma.website.design.model.Design;
import com.domysuma.website.design.model.DesignMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DesignMediaRepo extends JpaRepository<DesignMedia, Long> {
    List<DesignMedia> findAllByDesignAndIdNot(Design design, Long id);
}
