package ru.tusur.asu.tasc.tree_generator_api.service;

import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.tusur.asu.tasc.tree_generator_api.mapper.Mapper;

@AllArgsConstructor
public abstract class AbstractCrudService<
        DTO,
        ENTITY,
        ID,
        MAPPER extends Mapper<DTO, ENTITY>,
        REPO extends JpaRepository<ENTITY, ID>> {

    private final REPO repository;
    MAPPER mapper;

    public DTO save(DTO dto) {
        var entity = mapper.toEntity(dto);
        entity = repository.save(entity);
        return mapper.toDto(entity);
    }

    public DTO findById(ID id) {
        var entity = repository.findById(id).orElse(null); //TODO: replace with ex
        return mapper.toDto(entity);
    }

    public DTO update(DTO dto) {
        //TODO: implement later
        return null;
    }

    public void deleteById(ID id) {
        repository.deleteById(id);
    }
}
