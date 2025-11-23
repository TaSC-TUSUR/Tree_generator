package ru.tusur.asu.tasc.tree_generator_api.service;

import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ru.tusur.asu.tasc.tree_generator_api.mapper.Mapper;

//Костыльная херня крч весь этот класс, так лучше не оставлять, но это воскркресенье вечер
@AllArgsConstructor
public abstract class AbstractCrudService<
        DTO,
        ENTITY,
        ID,
        MAPPER extends Mapper<DTO, ENTITY>,
        REPO extends JpaRepository<ENTITY, ID>> {

    protected final REPO repository;
    protected final MAPPER mapper;

    @PostMapping
    public DTO save(@RequestBody DTO dto) {
        var entity = mapper.toEntity(dto);
        entity = repository.save(entity);
        return mapper.toDto(entity);
    }

    @GetMapping("/{id}")
    public DTO findById(@PathVariable ID id) {
        var entity = repository.findById(id).orElse(null); //TODO: replace with ex
        return mapper.toDto(entity);
    }

    //TODO: switch to normal method
    @PutMapping
    @SuppressWarnings("unchecked")
    public DTO update(@RequestBody DTO dto) {
        var entity = mapper.toEntity(dto);

        // Extract ID from the entity (mapper must set it)
        ID id;
        try {
            var idField = entity.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            id = (ID) idField.get(entity);
        } catch (Exception e) {
            throw new RuntimeException("Unable to read entity ID via reflection", e);
        }

        if (id == null || !repository.existsById(id)) {
            throw new RuntimeException("Entity with id " + id + " does not exist");
        }

        entity = repository.save(entity);
        return mapper.toDto(entity);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable ID id) {
        repository.deleteById(id);
    }
}
