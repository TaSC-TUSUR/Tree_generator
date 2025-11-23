package ru.tusur.asu.tasc.tree_generator_api.service;

import org.springframework.stereotype.Service;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.TemplateDto;
import ru.tusur.asu.tasc.tree_generator_api.entity.Template;
import ru.tusur.asu.tasc.tree_generator_api.mapper.TemplateMapper;
import ru.tusur.asu.tasc.tree_generator_api.repository.TemplateRepository;

@Service
public class TemplateService extends AbstractCrudService <
        TemplateDto,
        Template,
        Long,
        TemplateMapper,
        TemplateRepository>{
    public TemplateService(TemplateRepository repository, TemplateMapper mapper) {
        super(repository, mapper);
    }
}
