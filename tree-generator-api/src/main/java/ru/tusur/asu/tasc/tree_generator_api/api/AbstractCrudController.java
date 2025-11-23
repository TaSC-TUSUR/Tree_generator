package ru.tusur.asu.tasc.tree_generator_api.api;

import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.tusur.asu.tasc.tree_generator_api.mapper.Mapper;
import ru.tusur.asu.tasc.tree_generator_api.service.AbstractCrudService;

@AllArgsConstructor
public abstract class AbstractCrudController<
        DTO,
        ENTITY,
        ID,
        MAPPER extends Mapper<DTO, ENTITY>,
        REPO extends JpaRepository<ENTITY, ID>> {
    protected final AbstractCrudService<DTO, ENTITY, ID, MAPPER, REPO> service;

    public ResponseEntity<DTO> create(DTO request) {
        return new ResponseEntity<>(service.save(request), HttpStatus.OK);
    }

    public ResponseEntity<DTO> update(DTO request) {
        return new ResponseEntity<>(service.update(request), HttpStatus.OK);
    }

    public ResponseEntity<DTO> findById(ID id) {
        return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
    }

    //TODO: replace with default response
    public ResponseEntity<Object> delete(ID id) {
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
