-- -----------------------------------------------------
-- TABLE PROJECTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER NOT NULL,
    institutional_link_name VARCHAR(255) CHARACTER NULL DEFAULT NULL,
    start_season VARCHAR(15) CHARACTER NOT NULL,
    involved_classes LONGTEXT CHARACTER NOT NULL,
    pcc_calendar_classes_articulation LONGTEXT CHARACTER NOT NULL,
    preview_credits_classes LONGTEXT CHARACTER NOT NULL,
    infrastructure LONGTEXT CHARACTER NOT NULL,
    public_participation LONGTEXT CHARACTER NOT NULL,
    accompaniment_and_evaluation LONGTEXT CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE ACTIVITIES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER NOT NULL,
    description VARCHAR(255) CHARACTER NOT NULL,
    external TINYINT(1) NOT NULL DEFAULT 0,
    number_of_members INT(11) NOT NULL,
    date DATE NOT NULL,
    period INT(11) NOT NULL,
    execution_weekday VARCHAR(255) CHARACTER NOT NULL,
    execution_hour TIME NOT NULL,
    results VARCHAR(180) CHARACTER NOT NULL,
    projects_id BIGINT(20) UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX fk_activities_projects1_idx (projects_id ASC) VISIBLE,
    CONSTRAINT fk_activities_projects1
        FOREIGN KEY (projects_id)
        REFERENCES projects (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- TABLE ATTACHMENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS attachments (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    type ENUM('document', 'image', 'video', 'publication', 'event', 'assigns_list', 'other') CHARACTER NOT NULL,
    url VARCHAR(255) CHARACTER NOT NULL,
    original_file_name VARCHAR(255) CHARACTER NOT NULL,
    original_file_size DOUBLE(8,2) NOT NULL,
    file_name VARCHAR(255) CHARACTER NOT NULL,
    file_size DOUBLE(8,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE ACTIVITY_ATTACHMENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_attachments (
    activity_id BIGINT(20) UNSIGNED NOT NULL,
    attachment_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (activity_id, attachment_id),
    INDEX activity_attachments_activity_id_foreign (activity_id ASC) VISIBLE,
    INDEX activity_attachments_attachment_id_foreign (attachment_id ASC) VISIBLE,
    CONSTRAINT activity_attachments_activity_id_foreign FOREIGN KEY (activity_id) REFERENCES activities (id),
    CONSTRAINT activity_attachments_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachments (id)
);

-- -----------------------------------------------------
-- TABLE STUDENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(255) CHARACTER NOT NULL,
    course VARCHAR(255) CHARACTER NOT NULL,
    period INT(11) NOT NULL,
    scholarship TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE USERS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER NOT NULL,
    email VARCHAR(255) CHARACTER NOT NULL,
    phone VARCHAR(255) CHARACTER NOT NULL,
    password VARCHAR(255) CHARACTER NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    students_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX users_email_unique (email ASC) VISIBLE,
    INDEX fk_users_students1_idx (students_id ASC) VISIBLE,
    CONSTRAINT fk_users_students1 FOREIGN KEY (students_id) REFERENCES students (id)
);

-- -----------------------------------------------------
-- TABLE COLLABORATORS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS collaborators (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT(20) UNSIGNED NOT NULL,
    academic_function VARCHAR(255) CHARACTER NOT NULL,
    profissional_registry VARCHAR(255) CHARACTER NOT NULL,
    link_format VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX collaborators_user_id_foreign (user_id ASC) VISIBLE,
    CONSTRAINT collaborators_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id)
);

-- -----------------------------------------------------
-- TABLE DISCLOSURE_MEDIAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS disclosure_medias (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    name VARCHAR(255) CHARACTER NOT NULL,
    date DATE NOT NULL,
    link VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX disclosure_medias_project_id_foreign (project_id ASC) VISIBLE,
    CONSTRAINT disclosure_medias_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE EVENT_PRESENTATIONS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS event_presentations (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    name VARCHAR(255) CHARACTER NOT NULL,
    date DATE NOT NULL,
    modality VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX event_presentations_project_id_foreign (project_id ASC) VISIBLE,
    CONSTRAINT event_presentations_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE EXTENSION_LINES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS extension_lines (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    number INT(11) NOT NULL,
    name VARCHAR(255) CHARACTER NOT NULL,
    operation LONGTEXT CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE EVALUATION
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS evaluation (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    description LONGTEXT CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX finished_projects_project_id_foreign (project_id ASC) VISIBLE,
    CONSTRAINT finished_projects_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE FUTURE_DEVELOPMENT_PLANS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS future_development_plans (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    activities LONGTEXT CHARACTER NOT NULL,
    expected_results LONGTEXT CHARACTER NOT NULL,
    participants_number_forecast VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX future_development_plans_project_id_foreign (project_id ASC) VISIBLE,
    CONSTRAINT future_development_plans_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE HUMAN_RESOURCE_TYPES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS human_resource_types (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE PARTNERS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS partners (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    name VARCHAR(255) CHARACTER NOT NULL,
    contact VARCHAR(255) CHARACTER NOT NULL,
    phone VARCHAR(255) CHARACTER NOT NULL,
    email VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX involved_partners_project_id_foreign (project_id ASC) VISIBLE,
    UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE,
    CONSTRAINT involved_partners_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE KNOWLEDGE_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_areas (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE MIGRATIONS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS migrations (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    migration VARCHAR(255) CHARACTER NOT NULL,
    batch INT(11) NOT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE DEMANDS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS demands (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    description VARCHAR(255) CHARACTER NOT NULL,
    justification LONGTEXT CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX new_demands_project_id_foreign (project_id ASC) VISIBLE,
    CONSTRAINT new_demands_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE PUBLICATIONS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS publications (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    attachment_id BIGINT(20) UNSIGNED NULL DEFAULT NULL,
    type ENUM('artigo','capitulo','resumo') CHARACTER NOT NULL,
    title VARCHAR(255) CHARACTER NOT NULL,
    journal_name VARCHAR(255) CHARACTER NOT NULL,
    link VARCHAR(255) CHARACTER NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX performed_publications_project_id_foreign (project_id ASC) VISIBLE,
    INDEX performed_publications_attachment_id_foreign (attachment_id ASC) VISIBLE,
    CONSTRAINT performed_publications_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachments (id),
    CONSTRAINT performed_publications_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE PERMISSIONS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER NOT NULL,
    url VARCHAR(180) CHARACTER NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE PROJECT_ATTACHMENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_attachments (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    attachment_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (project_id, attachment_id),
    INDEX project_attachments_project_id_foreign (project_id ASC) VISIBLE,
    INDEX project_attachments_attachment_id_foreign (attachment_id ASC) VISIBLE,
    CONSTRAINT project_attachments_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachments (id),
    CONSTRAINT project_attachments_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE PROJECT_EXTENSION_LINES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_extension_lines (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    extension_line_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (project_id, extension_line_id),
    INDEX project_extension_lines_project_id_foreign (project_id ASC) VISIBLE,
    INDEX project_extension_lines_extension_line_id_foreign (extension_line_id ASC) VISIBLE,
    CONSTRAINT project_extension_lines_extension_line_id_foreign FOREIGN KEY (extension_line_id) REFERENCES extension_lines (id),
    CONSTRAINT project_extension_lines_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE PROJECT_HUMAN_RESOURCES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_human_resources (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT(20) UNSIGNED NOT NULL,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  human_resource_type_id BIGINT(20) UNSIGNED NOT NULL,
  coordinate TINYINT(1) NOT NULL DEFAULT 0,
  exclusive TINYINT(1) NOT NULL DEFAULT 0,
  workload INT(11) NOT NULL,
  initiated_at DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX project_human_resources_user_id_foreign (user_id ASC) VISIBLE,
  INDEX project_human_resources_project_id_foreign (project_id ASC) VISIBLE,
  INDEX project_human_resources_human_resource_type_id_foreign (human_resource_type_id ASC) VISIBLE,
  CONSTRAINT project_human_resources_human_resource_type_id_foreign FOREIGN KEY (human_resource_type_id) REFERENCES human_resource_types (id),
  CONSTRAINT project_human_resources_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id),
  CONSTRAINT project_human_resources_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id)
);
-- -----------------------------------------------------
-- TABLE PROJECT_KNOWLEDGE_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_knowledge_areas (
  project_id BIGINT(20) UNSIGNED NOT NULL,
  knowledge_area_id BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (project_id, knowledge_area_id),
  INDEX project_knowledge_areas_project_id_foreign (project_id ASC) VISIBLE,
  INDEX project_knowledge_areas_knowledge_area_id_foreign (knowledge_area_id ASC) VISIBLE,
  CONSTRAINT project_knowledge_areas_knowledge_area_id_foreign FOREIGN KEY (knowledge_area_id) REFERENCES knowledge_areas (id),
  CONSTRAINT project_knowledge_areas_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);
-- -----------------------------------------------------
-- TABLE PUBLICS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS publics (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) CHARACTER NOT NULL,
  cras VARCHAR(180) CHARACTER NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE PROJECT_PUBLICS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_publics (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    public_id BIGINT(20) UNSIGNED NOT NULL,
    directly TINYINT(1) NOT NULL DEFAULT 0,
    other_public_title VARCHAR(255) CHARACTER NULL DEFAULT NULL,
    other_public_cras VARCHAR(255) CHARACTER NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (project_id, public_id),
    INDEX project_publics_project_id_foreign (project_id ASC) VISIBLE,
    INDEX project_publics_public_id_foreign (public_id ASC) VISIBLE,
    CONSTRAINT project_publics_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT project_publics_public_id_foreign FOREIGN KEY (public_id) REFERENCES publics (id)
);

-- -----------------------------------------------------
-- TABLE PROJECT_TARGETS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_targets (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id BIGINT(20) UNSIGNED NOT NULL,
    men_number INT(11) NULL DEFAULT NULL,
    women_number INT(11) NULL DEFAULT NULL,
    age_range ENUM('Até 12 anos incompletos','Até 18 anos','De 19 a 25 anos','De 26 a 30 anos','De 31 a 50 anos','De 51 a 60 anos','De 61a 70 anos','Acima de 70 anos') CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX project_targets_project_id_foreign (project_id ASC) VISIBLE,
    CONSTRAINT project_targets_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- -----------------------------------------------------
-- TABLE THEME_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS theme_areas (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- TABLE PROJECT_THEME_AREAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_theme_areas (
    project_id BIGINT(20) UNSIGNED NOT NULL,
    theme_area_id BIGINT(20) UNSIGNED NOT NULL,
    main TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CUREENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (project_id, theme_area_id),
    INDEX project_theme_areas_project_id_foreign (project_id ASC) VISIBLE,
    INDEX project_theme_areas_theme_area_id_foreign (theme_area_id ASC) VISIBLE,
    CONSTRAINT project_theme_areas_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT project_theme_areas_theme_area_id_foreign FOREIGN KEY (theme_area_id) REFERENCES theme_areas (id)
);

-- -----------------------------------------------------
-- TABLE USER_PERMISSIONS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS user_permissions (
    user_id BIGINT(20) UNSIGNED NOT NULL,
    permission_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    INDEX user_permissions_user_id_foreign (user_id ASC) VISIBLE,
    INDEX user_permissions_permission_id_foreign (permission_id ASC) VISIBLE,
    CONSTRAINT user_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES permissions (id),
    CONSTRAINT user_permissions_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id)
);
