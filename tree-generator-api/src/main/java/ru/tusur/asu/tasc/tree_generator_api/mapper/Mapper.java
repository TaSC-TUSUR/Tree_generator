package ru.tusur.asu.tasc.tree_generator_api.mapper;

public interface Mapper<DTO, ENTITY> {
    ENTITY toEntity(DTO dto);
    DTO toDto(ENTITY entity);
}
