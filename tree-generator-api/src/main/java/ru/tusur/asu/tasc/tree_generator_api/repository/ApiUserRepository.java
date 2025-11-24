package ru.tusur.asu.tasc.tree_generator_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.tusur.asu.tasc.tree_generator_api.entity.ApiUser;

import java.util.Optional;

public interface ApiUserRepository extends JpaRepository<ApiUser, Long> {
    Optional<ApiUser> findByLogin(String login);
}
