package ru.tusur.asu.tasc.tree_generator_api.api.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String login;
    private String password;
}
