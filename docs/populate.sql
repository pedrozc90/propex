--------------------------------------------------
-- USERS
--------------------------------------------------
CREATE TABLE users (
    id BIGINT(20) INSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY uk_user_email (email)
);

INSERT INTO users (id, name, email, phone, password, created_at, updated_at)
    VALUES (1, 'admin', 'admin@domain.com', '(48) 99999-9999', 'admin', CURRENT_DATE(), NULL);

--------------------------------------------------
-- PERMISSIONS
--------------------------------------------------
CREATE TABLE permissions (
    id BIGINT(20) INSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(180) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL
);

--------------------------------------------------
-- USER PERMISSIONS
--------------------------------------------------
CREATE TABLE user_permissions (
    user_id BIGINT(20) INSIGNED NOT NULL,
    permission_id BIGINT(20) INSIGNED NOT NULL
    PRIMARY KEY (user_id, permission_id),
    CONSTRAINT fk_permission_id FOREIGN KEY (permission_id) REFERENCES permissions (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

--------------------------------------------------
-- THEME AREAS
--------------------------------------------------
CREATE TABLE theme_areas (
    id BIGINT(20) INSIGNED PRIMARY KEY AUTO_INCREMENT,
    area VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL
);

INSERT INTO theme_areas (id, area, created_at, updated_at) VALUES
    (1, 'Comunicação', NULL, NULL),
    (2, 'Meio Ambiente', NULL, NULL),
    (3, 'Cultura', NULL, NULL),
    (4, 'Saúde', NULL, NULL),
    (5, 'Direitos Humanos e Justiça', NULL, NULL),
    (6, 'Tecnologia e Produção', NULL, NULL),
    (7, 'Educação', NULL, NULL),
    (8, 'Trabalho', NULL, NULL);

--------------------------------------------------
-- STUDENTS
--------------------------------------------------
CREATE TABLE students (
    id BIGINT(20) INSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT(20) INSIGNED NOT NULL,
    student_code VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    period INT(11) NOT NULL,
    has_scholarship TINYINT(4) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_students_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

--------------------------------------------------
-- PUBLICS
--------------------------------------------------
CREATE TABLE publics (
    id BIGINT(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    cras VARCHAR(180) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at datetime DEFAULT NULL
);

INSERT INTO publics VALUES
    ( 1, 'Escolas públicas', NULL, NULL, NULL, NULL),
    ( 2, 'Escolas particulares', NULL, NULL, NULL, NULL),
    ( 3, 'Associações', NULL, NULL, NULL, NULL),
    ( 4, 'Pequenos produtores', NULL, NULL, NULL, NULL),
    ( 5, 'Pessoas com deficiência', NULL, NULL, NULL, NULL),
    ( 6, 'Negros/Índios/Quilombolas', NULL, NULL, NULL, NULL),
    ( 7, 'Adolescentes em conflito com a lei', NULL, NULL, NULL, NULL),
    ( 8, 'Indivíduos apenados e/ou egressos do sistema penitenciário', NULL, NULL, NULL, NULL),
    ( 9, 'Indivíduos em situação de rua (moradores de rua)', NULL, NULL, NULL, NULL),
    (10, 'Migrantes/Imigrantes', NULL, NULL, NULL, NULL),
    (11, 'Família', NULL, NULL, NULL, NULL),
    (12, 'Usuários de substâncias psicoativas', NULL, NULL, NULL, NULL),
    (13, 'Comunidades locais', NULL, NULL, NULL, NULL),
    (14, 'Comunidade científica', NULL, NULL, NULL, NULL),
    (15, 'Lideranças Locais', NULL, NULL, NULL, NULL),
    (16, 'Moradores de área de ocupação', NULL, NULL, NULL, NULL),
    (17, 'Outras ONG’s', NULL, NULL, NULL, NULL),
    (18, 'Organizações/movimentos populares', NULL, NULL, NULL, NULL),
    (19, 'Outros', NULL, NULL, NULL, NULL);

--------------------------------------------------
-- PROJECTS
--------------------------------------------------
CREATE TABLE projects (
    id BIGINT(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    institutional_link_name VARCHAR(255) DEFAULT NULL,
    start_season VARCHAR(15) NOT NULL,
    involved_classes LONGTEXT NOT NULL,
    pcc_calendar_classes_articulation LONGTEXT NOT NULL,
    preview_credits_classes LONGTEXT NOT NULL,
    infrastructure LONGTEXT NOT NULL,
    public_participation LONGTEXT NOT NULL,
    accompaniment_and_evaluation LONGTEXT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL
);

--------------------------------------------------
-- PROJECT THEME AREA
--------------------------------------------------
CREATE TABLE project_theme_areas (
    project_id BIGINT(20) unsigned NOT NULL,
    theme_area_id BIGINT(20) unsigned NOT NULL,
    main_area tinyint(4) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT pk_project_theme_area PRIMARY KEY (project_id, theme_area_id),
    CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_theme_area_id FOREIGN KEY (theme_area_id) REFERENCES theme_areas (id)
);

--------------------------------------------------
-- PROJECT TARGET
--------------------------------------------------
CREATE TABLE project_targets (
    id BIGINT(20) unsigned PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT(20) unsigned NOT NULL,
    men_number INT(11) DEFAULT NULL,
    women_number INT(11) DEFAULT NULL,
    age_range ENUM('Até 12 anos incompletos','Até 18 anos','De 19 a 25 anos','De 26 a 30 anos','De 31 a 50 anos','De 51 a 60 anos','De 61a 70 anos','Acima de 70 anos') NOT NULL,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP()),
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT project_targets_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);
