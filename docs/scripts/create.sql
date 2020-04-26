-- -----------------------------------------------------
-- Schema propex
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS propex DEFAULT CHARACTER SET utf8mb4;

USE propex ;

-- -----------------------------------------------------
-- TABLE PROJECTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    program VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    start_season VARCHAR(15) NOT NULL,
    included_courses LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    ppc_and_course_calendar LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    required_courses_credits LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    infrastructure LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    public_participation LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    accompaniment_and_evaluation LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE ACTIVITIES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    projects_id BIGINT(20) UNSIGNED NOT NULL,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    description VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    external TINYINT(1) NOT NULL DEFAULT 0,
    number_of_members INT(11) NOT NULL,
    date DATE NOT NULL,
    period INT(11) NOT NULL,
    execution_weekday VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    execution_hour TIME NOT NULL,
    results VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (projects_id ASC) VISIBLE,
    CONSTRAINT fk_activities_to_projects FOREIGN KEY (projects_id) REFERENCES projects (id) ON DELETE NO ACTION ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE ATTACHMENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS attachments (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    type VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL DEFAULT 'DOCUMENT',
    url VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    original_file_name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    original_file_size DOUBLE(8,2) NOT NULL,
    file_name INT NOT NULL,
    file_size DOUBLE(8,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE ACTIVITY_ATTACHMENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_attachments (
    activity_id BIGINT(20) UNSIGNED NOT NULL,
    attachment_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (activity_id, attachment_id),
    INDEX idx_activity_id (activity_id ASC) VISIBLE,
    INDEX idx_attachment_id (attachment_id ASC) VISIBLE,
    CONSTRAINT fk_activity_attachments_activitys FOREIGN KEY (activity_id) REFERENCES activities (id),
    CONSTRAINT fk_activity_attachments_attachments FOREIGN KEY (attachment_id) REFERENCES attachments (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE USERS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(32) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX uk_users_email (email ASC) VISIBLE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE COLLABORATORS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS collaborators (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    academic_function VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    profissional_registry VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    affiliation VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    users_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    INDEX fk_collaborators_users1_idx (users_id ASC) VISIBLE,
    CONSTRAINT fk_collaborators_users FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE DISCLOSURE_MEDIAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS disclosure_medias (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    link VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    CONSTRAINT fk_disclosure_medias_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE EVENT_PRESENTATIONS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS event_presentations (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    modality VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    CONSTRAINT fk_event_presentations_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE EXTENSION_LINES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS extension_lines (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    number INT(11) NOT NULL,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    operation LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE EVALUATION
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS evaluation (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    description LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX fk_evaluation_projects (project_id ASC) VISIBLE,
    CONSTRAINT fk_evaluation_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE FUTURE_DEVELOPMENT_PLANS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS future_development_plans (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    activities LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    expected_results LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    participants_number VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    CONSTRAINT fk_future_development_plans_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PARTNERS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS partners (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    name VARCHAR(128) NOT NULL,
    contact VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    UNIQUE INDEX uk_partner_email (email ASC) VISIBLE,
    CONSTRAINT fk_partners_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE KNOWLEDGE_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_areas (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE DEMANDS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS demands (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    description VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    justification LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    CONSTRAINT fk_demands_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PUBLICATIONS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS publications (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    attachment_id BIGINT(20) UNSIGNED NOT NULL,
    type VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    title VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    journal_name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    link VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    INDEX idx_attachment_id (attachment_id ASC) VISIBLE,
    CONSTRAINT fk_publications_attachments FOREIGN KEY (attachment_id) REFERENCES attachments (id),
    CONSTRAINT fk_publications_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PROJECT_ATTACHMENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_attachments (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    attachment_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (project_id, attachment_id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    INDEX idx_attachment_id (attachment_id ASC) VISIBLE,
    CONSTRAINT fk_project_attachments_attachments FOREIGN KEY (attachment_id) REFERENCES attachments (id),
    CONSTRAINT fk_project_attachments_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PROJECT_EXTENSION_LINES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_extension_lines (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    extension_line_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (project_id, extension_line_id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    INDEX idx_extension_line_id (extension_line_id ASC) VISIBLE,
    CONSTRAINT fk_project_extension_lines_extension_lines FOREIGN KEY (extension_line_id) REFERENCES extension_lines (id),
    CONSTRAINT fk_project_extension_lines_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE STUDENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    course VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    period INT(11) NOT NULL,
    scholarship TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    users_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    INDEX fk_students_users1_idx (users_id ASC) VISIBLE,
    CONSTRAINT fk_students_users1 FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PROJECT_HUMAN_RESOURCES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_human_resources (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    collaborators_id BIGINT(20) UNSIGNED NOT NULL,
    students_id BIGINT(20) UNSIGNED NOT NULL,
    coordinate TINYINT(1) NOT NULL DEFAULT 0,
    exclusive TINYINT(1) NOT NULL DEFAULT 0,
    workload INT(11) NOT NULL,
    dt_admission DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_project_id (project_id ASC) VISIBLE,
    INDEX idx_collaborator_id (collaborators_id ASC) VISIBLE,
    INDEX idx_student_id (students_id ASC) VISIBLE,
    CONSTRAINT fk_project_human_resources_projects FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_project_human_resources_collaborators FOREIGN KEY (collaborators_id) REFERENCES collaborators (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_project_human_resources_students FOREIGN KEY (students_id) REFERENCES students (id) ON DELETE NO ACTION ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PROJECT_KNOWLEDGE_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_knowledge_areas (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    knowledge_area_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (project_id, knowledge_area_id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    INDEX idx_knowledge_area_id (knowledge_area_id ASC) VISIBLE,
    CONSTRAINT fk_project_knowledge_areas_knowledge_areas FOREIGN KEY (knowledge_area_id) REFERENCES knowledge_areas (id),
    CONSTRAINT fk_project_knowledge_areas_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PUBLICS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS publics (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    cras VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PROJECT_PUBLICS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_publics (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    public_id BIGINT(20) UNSIGNED NOT NULL,
    directly TINYINT(1) NOT NULL DEFAULT 0,
    others_title VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    others_cras VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (project_id, public_id),
    INDEX fk_project_publics_projects (project_id ASC) VISIBLE,
    INDEX fk_project_publics_publics (public_id ASC) VISIBLE,
    CONSTRAINT fk_project_publics_projects FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_project_publics_publics FOREIGN KEY (public_id) REFERENCES publics (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PROJECT_TARGETS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_targets (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    men_number INT(11) NULL DEFAULT 0,
    women_number INT(11) NULL DEFAULT 0,
    age_range VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    CONSTRAINT fk_project_targets_projects FOREIGN KEY (project_id) REFERENCES projects (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE THEME_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS theme_areas (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

-- -----------------------------------------------------
-- TABLE PROJECT_THEME_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_theme_areas (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    theme_area_id BIGINT(20) UNSIGNED NOT NULL,
    main TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP(6)),
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (project_id, theme_area_id),
    INDEX idx_project_id (project_id ASC) VISIBLE,
    INDEX idx_theme_area_id (theme_area_id ASC) VISIBLE,
    CONSTRAINT fk_project_theme_areas_projects FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_project_theme_areas_theme_areas FOREIGN KEY (theme_area_id) REFERENCES theme_areas (id)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
