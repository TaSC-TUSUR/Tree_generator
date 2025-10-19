package ru.tusur.asu.tasc.tree_generator_api.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ForestData(
        Meta meta,
        List<ForestObject> objects
) {

    public record Meta(
            LocalDateTime createdAt,
            CanvasSize canvasSize,
            TransformSettings transformSettings,
            String unrealNote
    ) {
    }

    public record CanvasSize(
            int w,
            int h
    ) {
    }

    public record TransformSettings(
            double originX,
            double originY,
            double scale,
            boolean invertY
    ) {
    }

    public record ForestObject(
            String id,
            String model,
            Location location,
            double rotationDegrees,
            double scale
    ) {
    }

    public record Location(
            double x,
            double y,
            double z
    ) {
    }
}
