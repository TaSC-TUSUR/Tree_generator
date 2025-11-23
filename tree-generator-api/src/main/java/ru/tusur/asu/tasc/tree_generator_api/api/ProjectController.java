//package ru.tusur.asu.tasc.tree_generator_api.api;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RestController;
//import ru.tusur.asu.tasc.tree_generator_api.api.dto.ProjectDto;
//import ru.tusur.asu.tasc.tree_generator_api.entity.Project;
//
//@RestController
//@RequestMapping("/api/projects")
//public class ProjectController extends AbstractCrudController<
//        ProjectDto, Project, Long, ProjectMapper, ProjectRepository> {
//
//    public ProjectController(AbstractCrudService<ProjectDto, Project, Long, ProjectMapper, ProjectRepository> service) {
//        super(service);
//    }
//
//    @GetMapping
//    public ResponseEntity<List<ProjectDto>> getAll() {
//        return ResponseEntity.ok(service.findAll());
//    }
//
//    @PostMapping("/{id}/settings")
//    public ResponseEntity<ProjectDto> updateSettings(@PathVariable Long id, @RequestBody ProjectSettingsDto settings) {
//        return ResponseEntity.ok(service.updateSettings(id, settings));
//    }
//}
