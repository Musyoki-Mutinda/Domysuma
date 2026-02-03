package com.domysuma.website.app.repository;

import com.domysuma.website.app.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface RegionRepo extends JpaRepository<Region, Long> {

}
