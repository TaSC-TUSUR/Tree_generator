package ru.tusur.asu.tasc.tree_generator_api.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.TemplateDto;
import ru.tusur.asu.tasc.tree_generator_api.entity.Template;

@Component
public class TemplateMapper extends AbstractMapper<TemplateDto, Template> {

    public TemplateMapper() {
        super(TemplateDto.class, Template.class);
    }

    @Override
    protected void configureAdditionalMappings(ModelMapper mapper) {
        // Map userId and projectId manually
        mapper.typeMap(Template.class, TemplateDto.class).addMappings(m -> {
            m.map(src -> src.getUser().getId(), TemplateDto::setUserId);
            m.map(src -> src.getProject().getId(), TemplateDto::setProjectId);
        });

        mapper.typeMap(TemplateDto.class, Template.class).addMappings(m -> {
            m.skip(Template::setSimulations); // skip simulations on update/create
        });
    }
}

