package ru.tusur.asu.tasc.tree_generator_api.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateDto {
    private Long id;
    private Long userId;
    private Long projectId;
    private String name;
    private String description;
    private String parameters;
    private LocalDateTime createdAt;
}
