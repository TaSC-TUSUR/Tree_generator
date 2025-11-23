package ru.tusur.asu.tasc.tree_generator_api.service;

import org.springframework.stereotype.Service;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.ProjectDto;
import ru.tusur.asu.tasc.tree_generator_api.entity.Project;
import ru.tusur.asu.tasc.tree_generator_api.mapper.ProjectMapper;
import ru.tusur.asu.tasc.tree_generator_api.repository.ProjectRepository;

import java.util.List;

@Service
public class ProjectService extends AbstractCrudService<
        ProjectDto,
        Project,
        Long,
        ProjectMapper,
        ProjectRepository> {

    public ProjectService(ProjectRepository repository, ProjectMapper mapper) {
        super(repository, mapper);
    }

    //TODO: pagination
    public List<ProjectDto> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public ProjectDto findByName(String title) {
        var dto = repository.findByTitle(title).orElse(null);
        return mapper.toDto(dto); // Прям херня
    }
}
