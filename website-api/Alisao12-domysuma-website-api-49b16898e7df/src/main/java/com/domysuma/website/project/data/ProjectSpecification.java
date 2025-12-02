package com.domysuma.website.project.data;

import com.domysuma.website.design.model.Design;
import com.domysuma.website.project.data.dto.request.ProjectSearch;
import com.domysuma.website.project.model.Project;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;

public class ProjectSpecification {
    public static Specification<Project> createSpecification(ProjectSearch request) {
        var title = "%" + request.getTitle() + "%";
        var description = "%" + request.getDescription() + "%";

        return (root, query, cb) -> {
            final ArrayList<Predicate> predicates = new ArrayList<>();

            if ((request.getTitle() != null) && !request.getTitle().equals("")) {
                predicates.add(cb.like(root.get("title"), title));
            }
            if ((request.getDescription() != null) && !request.getDescription().equals("")) {
                predicates.add(cb.like(root.get("description"), description));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
