package com.agripulse.api.service.specification;

import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class FieldFilterSpecification {

    public static <T> Specification<T> filterEquals(Class<T> clazz, String field, String value) {
        if (value == null || value.isEmpty()) {
            return (root, query, cb) -> null;
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(fieldToPath(field, root), value);
    }

    public static <T, V> Specification<T> filterEqualsV(Class<T> clazz, String field, V value) {
        if (value == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(fieldToPath(field, root), value);
    }

    public static <T, V extends Comparable<V>> Specification<T> greaterThan(Class<T> clazz, String field, V value) {
        if (value == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(fieldToPath(field, (Root<V>) root), value);
    }

    public static <T> Specification<T> filterEquals(Class<T> clazz, String field, Long value) {
        if (value == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(fieldToPath(field, root), value);
    }

    public static <T> Specification<T> filterContainsText(Class<T> clazz, String field, String value) {
        if (value == null || value.isEmpty()) {
            return (root, query, cb) -> null;
        }

        return (root, query, criteriaBuilder) -> criteriaBuilder.like(
                criteriaBuilder.lower(fieldToPath(field, (Root<String>) root)),
                "%" + value.toLowerCase() + "%"
        );
    }

    public static <T> Specification<T> filterJoinContains(Class<T> clazz, String joinField, String targetField, Object value) {
        if (value == null) {
            return (root, query, cb) -> null;
        }

        return (root, query, cb) -> {
            var join = root.join(joinField);
            return cb.equal(fieldToPath(targetField, join), value);
        };
    }

    public static <T> Specification<T> filterCollectionContains(Class<T> clazz, String collectionField, Object value) {
        if (value == null) {
            return (root, query, cb) -> null;
        }

        return (root, query, cb) -> {
            query.distinct(true);
            var join = root.join(collectionField);
            return cb.equal(join, value);
        };
    }

    private static <T> Path<T> fieldToPath(String field, From<?, ?> root) {
        String[] parts = field.split("\\.");
        Path<?> res = root;
        for (String p : parts) {
            res = res.get(p);
        }
        return (Path<T>) res;
    }
}
