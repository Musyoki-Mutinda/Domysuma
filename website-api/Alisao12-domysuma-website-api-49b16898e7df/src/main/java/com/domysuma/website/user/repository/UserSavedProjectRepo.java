package com.domysuma.website.user.repository;

import com.domysuma.website.user.model.User;
import com.domysuma.website.user.model.UserSavedProject;
import com.domysuma.website.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSavedProjectRepo extends JpaRepository<UserSavedProject, Long> {

    Optional<UserSavedProject> findByUserAndProjectAndActive(User user, Project project, Boolean active);

    List<UserSavedProject> findByUserAndActive(User user, Boolean active);

    @Query("SELECT usp FROM UserSavedProject usp WHERE usp.user = :user AND usp.active = true")
    List<UserSavedProject> findActiveSavedProjectsByUser(@Param("user") User user);

    boolean existsByUserAndProjectAndActive(User user, Project project, Boolean active);
}