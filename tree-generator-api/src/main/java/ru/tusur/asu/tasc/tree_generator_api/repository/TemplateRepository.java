package ru.tusur.asu.tasc.tree_generator_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.tusur.asu.tasc.tree_generator_api.entity.Template;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
}
