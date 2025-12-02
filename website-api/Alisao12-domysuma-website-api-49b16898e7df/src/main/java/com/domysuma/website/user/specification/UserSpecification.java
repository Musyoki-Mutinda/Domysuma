package com.domysuma.website.user.specification;

import com.domysuma.website.user.data.dto.UserSearch;
import com.domysuma.website.user.model.User;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;

public class UserSpecification {
    public static Specification<User> createSpecification(UserSearch request) {
        var username = "%" + request.getUsername() + "%";
        return (root, query, cb) -> {
            final ArrayList<Predicate> predicates = new ArrayList<>();

            if (request.getUsername() != null && !request.getUsername().isEmpty())
                predicates.add(cb.like(root.get("username"), username));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
