package ru.tusur.asu.tasc.tree_generator_api.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.TemplateDto;
import ru.tusur.asu.tasc.tree_generator_api.entity.Template;
import ru.tusur.asu.tasc.tree_generator_api.mapper.TemplateMapper;
import ru.tusur.asu.tasc.tree_generator_api.repository.TemplateRepository;
import ru.tusur.asu.tasc.tree_generator_api.service.TemplateService;

@RestController
@RequestMapping("/api/templates")
public class TemplateController extends AbstractCrudController<
        TemplateDto, Template, Long, TemplateMapper, TemplateRepository> {

    public TemplateController(TemplateService service) {
        super(service);
    }

    @PostMapping
    public ResponseEntity<TemplateDto> create(@RequestBody TemplateDto dto) {
        return super.create(dto);
    }

    @PutMapping
    public ResponseEntity<TemplateDto> update(@RequestBody TemplateDto dto) {
        return super.update(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateDto> findById(@PathVariable Long id) {
        return super.findById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        return super.delete(id);
    }
}
