package ru.tusur.asu.tasc.tree_generator_api.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.tusur.asu.tasc.tree_generator_api.api.dto.ForestData;

import static ru.tusur.asu.tasc.tree_generator_api.api.Paths.GENERATE;
import static ru.tusur.asu.tasc.tree_generator_api.api.Paths.ROOT;

@Slf4j
@RestController
@RequiredArgsConstructor
public class GeneratorController {

    @PostMapping(path = ROOT + GENERATE)
    public ForestData generate(@RequestBody ForestData data) {
        log.info("!!!!!!!!!!!!!!!!!!!!");
        log.info("Generate tree");

        return data;
    }
}
