package ru.tusur.asu.tasc.tree_generator_api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dictionary_project_role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DictionaryProjectRole {

    @Id
    @Column(length = 3)
    private String code;

    @Column(nullable = false, length = 30, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}
