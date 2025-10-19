--liquibase formatted sql
--changeset StepanenkoES:001

-- Таблица ролей
CREATE TABLE api_roles
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(30) NOT NULL UNIQUE,
    description TEXT
);

COMMENT ON TABLE api_roles IS 'Роли пользователей и их описания (admin, analyst, guest).';
COMMENT ON COLUMN api_roles.name IS 'Название роли: admin, analyst, guest.';
COMMENT ON COLUMN api_roles.description IS 'Текстовое описание прав и обязанностей роли.';

-- Таблица пользователей
CREATE TABLE api_user
(
    id            SERIAL PRIMARY KEY,
    login         VARCHAR(50) NOT NULL UNIQUE,
    email         VARCHAR(100) UNIQUE,
    password_hash TEXT        NOT NULL,
    full_name     VARCHAR(100),
    role_id       INT         REFERENCES api_roles (id) ON DELETE SET NULL,
    created_at    TIMESTAMP DEFAULT now()
);

COMMENT ON TABLE api_user IS 'Учётные записи пользователей приложения.';
COMMENT ON COLUMN api_user.login IS 'Логин пользователя для входа.';
COMMENT ON COLUMN api_user.email IS 'Электронная почта пользователя.';
COMMENT ON COLUMN api_user.password_hash IS 'Хэш пароля (bcrypt/argon2 и т.п.).';
COMMENT ON COLUMN api_user.full_name IS 'Полное имя пользователя.';
COMMENT ON COLUMN api_user.role_id IS 'Ссылка на роль пользователя (roles.id).';
COMMENT ON COLUMN api_user.created_at IS 'Дата и время создания учётной записи.';

-- Таблица проектов
CREATE TABLE project
(
    id            SERIAL PRIMARY KEY,
    owner_id      INT          REFERENCES api_user (id) ON DELETE SET NULL,
    title         VARCHAR(100) NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT now(),
    last_modified TIMESTAMP DEFAULT now(),
    is_public     BOOLEAN   DEFAULT false
);
CREATE INDEX idx_project_owner ON project (owner_id);
COMMENT ON TABLE project IS 'Проекты симуляций (группа работ, набор симуляций).';
COMMENT ON COLUMN project.is_public IS 'Флаг публичности проекта (доступен гостям).';

-- Таблица симуляций
CREATE TABLE simulation
(
    id          SERIAL PRIMARY KEY,
    project_id  INT REFERENCES project (id) ON DELETE CASCADE,
    started_by  INT REFERENCES api_user (id) ON DELETE SET NULL,
    status      VARCHAR(20) DEFAULT 'pending',
    started_at  TIMESTAMP   DEFAULT now(),
    finished_at TIMESTAMP
);
CREATE INDEX idx_simulation_project ON simulation (project_id);
COMMENT ON TABLE simulation IS 'Фиксированные запуски симуляций (копия параметров и путь к результатам).';

-- Таблица шаблонов
CREATE TABLE template
(
    id            SERIAL PRIMARY KEY,
    user_id       INT          REFERENCES api_user (id) ON DELETE SET NULL,
    simulation_id INT          REFERENCES simulation (id) ON DELETE SET NULL,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    parameters    JSONB,
    created_at    TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_template_user ON template (user_id);
COMMENT ON TABLE template IS 'Сохранённые шаблоны параметров симуляций для быстрого применения.';


-- Таблица результатов симуляции
CREATE TABLE simulation_result
(
    id             SERIAL PRIMARY KEY,
    simulation_id  INT REFERENCES simulation (id) ON DELETE CASCADE,
    result_zip     BYTEA,
    created_at     TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_result_simulation ON simulation_result (simulation_id);

COMMENT ON TABLE simulation_result IS 'Результаты выполнения симуляции, включая архив изображений.';
COMMENT ON COLUMN simulation_result.simulation_id IS 'Ссылка на симуляцию, к которой относится результат.';
COMMENT ON COLUMN simulation_result.result_zip IS 'ZIP-архив фотографий (в бинарном формате).';
COMMENT ON COLUMN simulation_result.created_at IS 'Дата и время сохранения результата.';
