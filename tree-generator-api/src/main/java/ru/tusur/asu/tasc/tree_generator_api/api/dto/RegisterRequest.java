package ru.tusur.asu.tasc.tree_generator_api.api.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String login;
    private String email;
    private String password;
    private String fullName;
}

