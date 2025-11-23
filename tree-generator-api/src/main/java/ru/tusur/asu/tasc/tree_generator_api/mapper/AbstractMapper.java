package ru.tusur.asu.tasc.tree_generator_api.mapper;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

public abstract class AbstractMapper<DTO, ENTITY> implements Mapper<DTO, ENTITY> {

    protected final ModelMapper mapper;
    private final Class<DTO> dtoClass;
    private final Class<ENTITY> entityClass;

    protected AbstractMapper(Class<DTO> dtoClass, Class<ENTITY> entityClass) {
        this.dtoClass = dtoClass;
        this.entityClass = entityClass;
        this.mapper = new ModelMapper();

        configureMapper(this.mapper);
        configureAdditionalMappings(this.mapper);
    }

    protected void configureMapper(ModelMapper mapper) {
        mapper.getConfiguration()
                .setSkipNullEnabled(true)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                .setMatchingStrategy(MatchingStrategies.STANDARD);
    }

    protected void configureAdditionalMappings(ModelMapper mapper) {
    }

    @Override
    public ENTITY toEntity(DTO dto) {
        return mapper.map(dto, entityClass);
    }

    @Override
    public DTO toDto(ENTITY entity) {
        return mapper.map(entity, dtoClass);
    }
}
