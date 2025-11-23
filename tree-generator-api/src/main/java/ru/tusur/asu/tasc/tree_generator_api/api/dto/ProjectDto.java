package ru.tusur.asu.tasc.tree_generator_api.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {
    private Long id;
    private Long ownerId;
    private String title;
    private String description;
    private Boolean isPublic;
    private Instant createdAt;
    private LocalDateTime updatedAt;
}