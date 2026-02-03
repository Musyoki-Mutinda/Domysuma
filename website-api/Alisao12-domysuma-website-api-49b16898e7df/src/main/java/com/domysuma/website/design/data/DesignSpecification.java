package com.domysuma.website.design.data;

import com.domysuma.website.design.data.dto.request.DesignSearch;
import com.domysuma.website.design.model.Design;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;

public class DesignSpecification {
    public static Specification<Design> createSpecification(DesignSearch request) {
        var code = "%" + request.getCode() + "%";
        var name = "%" + request.getName() + "%";
        var description = "%" + request.getDescription() + "%";

        return (root, query, cb) -> {
            final ArrayList<Predicate> predicates = new ArrayList<>();

            if ((request.getCode() != null) && !request.getCode().equals("")) {
                predicates.add(cb.like(root.get("code"), code));
            }
            if ((request.getName() != null) && !request.getName().equals("")) {
                predicates.add(cb.like(root.get("name"), name));
            }
            if ((request.getDescription() != null) && !request.getDescription().equals("")) {
                predicates.add(cb.like(root.get("description"), description));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
