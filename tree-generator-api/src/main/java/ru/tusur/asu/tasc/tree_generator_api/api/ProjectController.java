package ru.tusur.asu.tasc.tree_generator_api.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.ProjectDto;
import ru.tusur.asu.tasc.tree_generator_api.entity.Project;
import ru.tusur.asu.tasc.tree_generator_api.mapper.ProjectMapper;
import ru.tusur.asu.tasc.tree_generator_api.repository.ProjectRepository;
import ru.tusur.asu.tasc.tree_generator_api.service.ProjectService;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController extends AbstractCrudController<
        ProjectDto, Project, Long, ProjectMapper, ProjectRepository> {

    public ProjectController(ProjectService service) {
        super(service);
    }

    @PostMapping
    public ResponseEntity<ProjectDto> create(@RequestBody ProjectDto dto) {
        return super.create(dto);
    }

    @PutMapping
    public ResponseEntity<ProjectDto> update(@RequestBody ProjectDto dto) {
        return super.update(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> findById(@PathVariable Long id) {
        return super.findById(id);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProjectDto>> findAll() {
        var resp = ((ProjectService) service).findAll(); // Больше костылей для маленькго проекта
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<ProjectDto> findByTitle(@PathVariable String title) {
        var resp = ((ProjectService) service).findByName(title); // Больше костылей для маленькго проекта
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        return super.delete(id);
    }
}

