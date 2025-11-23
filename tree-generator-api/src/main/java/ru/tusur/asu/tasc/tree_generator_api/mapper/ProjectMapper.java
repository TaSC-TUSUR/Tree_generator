package ru.tusur.asu.tasc.tree_generator_api.mapper;

import org.springframework.stereotype.Service;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.ProjectDto;
import ru.tusur.asu.tasc.tree_generator_api.entity.Project;

@Service
public class ProjectMapper extends AbstractMapper<ProjectDto, Project> {

    public ProjectMapper() {
        super(ProjectDto.class, Project.class);
    }
}
