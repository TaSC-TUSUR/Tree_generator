--liquibase formatted sql
--changeset StepanenkoES:001

-- ===============================
-- Таблица пользователей
-- ===============================
CREATE TABLE api_user
(
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    login         VARCHAR(50) NOT NULL UNIQUE,
    email         VARCHAR(100) UNIQUE,
    password_hash TEXT        NOT NULL,
    full_name     VARCHAR(100),
    created_at    TIMESTAMP DEFAULT now()
);

COMMENT ON TABLE api_user IS 'Учётные записи пользователей приложения.';
COMMENT ON COLUMN api_user.login IS 'Логин пользователя для входа.';
COMMENT ON COLUMN api_user.email IS 'Электронная почта пользователя.';
COMMENT ON COLUMN api_user.password_hash IS 'Хэш пароля (bcrypt/argon2 и т.п.).';
COMMENT ON COLUMN api_user.full_name IS 'Полное имя пользователя.';
COMMENT ON COLUMN api_user.created_at IS 'Дата и время создания учётной записи.';

-- ===============================
-- Таблица проектов
-- ===============================
CREATE TABLE project
(
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id      BIGINT REFERENCES api_user (id) ON DELETE SET NULL,
    title         VARCHAR(100) NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT now(),
    updated_at    TIMESTAMP DEFAULT now(),
    is_public     BOOLEAN   DEFAULT false
);
CREATE INDEX idx_project_owner ON project (owner_id);

COMMENT ON TABLE project IS 'Проекты симуляций (группа работ, набор симуляций).';
COMMENT ON COLUMN project.is_public IS 'Флаг публичности проекта (доступен гостям).';

-- ===============================
-- Таблица ролей проекта (справочник)
-- ===============================
CREATE TABLE dictionary_project_role
(
    code        VARCHAR(3) PRIMARY KEY,
    name        VARCHAR(30) NOT NULL UNIQUE,
    description TEXT
);

COMMENT ON TABLE dictionary_project_role IS 'Роли пользователей и их описания (admin, analyst, guest).';
COMMENT ON COLUMN dictionary_project_role.name IS 'Название роли: admin, analyst, guest.';
COMMENT ON COLUMN dictionary_project_role.description IS 'Текстовое описание прав и обязанностей роли.';

-- ===============================
-- Таблица участников проекта
-- ===============================
CREATE TABLE project_user
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES project (id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES api_user (id) ON DELETE CASCADE,
    role_code   VARCHAR(3) REFERENCES dictionary_project_role (code) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT now(),
    UNIQUE (project_id, user_id)
);

CREATE INDEX idx_project_user_project ON project_user (project_id);
CREATE INDEX idx_project_user_user ON project_user (user_id);

COMMENT ON TABLE project_user IS 'Участники проекта с ролями (admin, analyst, guest).';
COMMENT ON COLUMN project_user.role_code IS 'Код роли участника (ссылка на справочник ролей).';
COMMENT ON COLUMN project_user.created_at IS 'Дата добавления участника в проект.';

-- ===============================
-- Таблица шаблонов симуляций
-- ===============================
CREATE TABLE template
(
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id       BIGINT REFERENCES api_user (id) ON DELETE SET NULL,
    project_id    BIGINT REFERENCES project (id) ON DELETE SET NULL,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    parameters    JSONB,
    created_at    TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_template_user ON template (user_id);

COMMENT ON TABLE template IS 'Сохранённые шаблоны параметров симуляций для быстрого применения.';

-- ===============================
-- Таблица симуляций
-- ===============================
CREATE TABLE simulation
(
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    template_id  BIGINT REFERENCES template (id) ON DELETE CASCADE,
    user_id      BIGINT REFERENCES api_user (id) ON DELETE SET NULL,
    status       VARCHAR(20) DEFAULT 'pending',
    started_at   TIMESTAMP DEFAULT now(),
    finished_at  TIMESTAMP
);

CREATE INDEX idx_simulation_template ON simulation (template_id);

COMMENT ON TABLE simulation IS 'Фиксированные запуски симуляций (копия параметров и путь к результатам).';

-- ===============================
-- Таблица результатов симуляций
-- ===============================
CREATE TABLE simulation_result
(
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    simulation_id  BIGINT REFERENCES simulation (id) ON DELETE CASCADE,
    result_zip     BYTEA,
    created_at     TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_result_simulation ON simulation_result (simulation_id);

COMMENT ON TABLE simulation_result IS 'Результаты выполнения симуляции, включая архив изображений.';
COMMENT ON COLUMN simulation_result.simulation_id IS 'Ссылка на симуляцию, к которой относится результат.';
COMMENT ON COLUMN simulation_result.result_zip IS 'ZIP-архив фотографий (в бинарном формате).';
COMMENT ON COLUMN simulation_result.created_at IS 'Дата и время сохранения результата.';
