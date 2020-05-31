-- -----------------------------------------------------
-- Schema propex
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS propex;

CREATE SCHEMA IF NOT EXISTS propex DEFAULT CHARACTER SET utf8mb4;

USE propex;

-- -----------------------------------------------------
-- TABLE PROJECTS
-- -----------------------------------------------------
DROP TABLE IF EXISTS projects;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  program VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  start_season VARCHAR(15) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  included_courses LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  ppc_and_course_calendar LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  required_courses_credits LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  infrastructure LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  public_participation LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  accompaniment_and_evaluation LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE ACTIVITIES
-- -----------------------------------------------------
DROP TABLE IF EXISTS activities;

CREATE TABLE IF NOT EXISTS activities (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  description VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  external TINYINT(1) NOT NULL DEFAULT 0,
  number_of_members INT(11) NOT NULL,
  date DATE NOT NULL,
  period INT(11) NOT NULL,
  execution_weekday VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  execution_hour TIME NOT NULL,
  results VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_activities_project_id (project_id ASC) VISIBLE,
  CONSTRAINT activities_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE ATTACHMENTS
-- -----------------------------------------------------
DROP TABLE IF EXISTS attachments;

CREATE TABLE IF NOT EXISTS attachments (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  url VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  content_type VARCHAR(32) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  extension VARCHAR(32) NOT NULL,
  file_size DOUBLE(8,2) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_name_normalized VARCHAR(255) NOT NULL,
  content LONGBLOB NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE ACTIVITY_ATTACHMENTS
-- -----------------------------------------------------
DROP TABLE IF EXISTS activity_attachments;

CREATE TABLE IF NOT EXISTS activity_attachments (
  activity_id BIGINT(20) UNSIGNED NOT NULL,
  attachment_id BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (activity_id, attachment_id),
  INDEX idx_activity_attachments_activity_id (activity_id ASC) VISIBLE,
  INDEX idx_activity_attachments_attachment_id (attachment_id ASC) VISIBLE,
  CONSTRAINT activity_attachments_fk_activitys
    FOREIGN KEY (activity_id)
    REFERENCES activities (id),
  CONSTRAINT activity_attachments_fk_attachments
    FOREIGN KEY (attachment_id)
    REFERENCES attachments (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE USERS
-- -----------------------------------------------------
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  email VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  phone VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  password VARCHAR(32) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uk_users_email (email ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE COLLABORATORS
-- -----------------------------------------------------
DROP TABLE IF EXISTS collaborators;

CREATE TABLE IF NOT EXISTS collaborators (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT(20) UNSIGNED NOT NULL,
  academic_function VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  profissional_registry VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  affiliation VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_collaborators_user_id (user_id ASC) VISIBLE,
  CONSTRAINT collaborators_fk_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE DISCLOSURE_MEDIAS
-- -----------------------------------------------------
DROP TABLE IF EXISTS disclosure_medias;

CREATE TABLE IF NOT EXISTS disclosure_medias (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  link VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_disclosure_medias_project_id (project_id ASC) VISIBLE,
  CONSTRAINT disclosure_medias_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE EVENTS
-- -----------------------------------------------------
DROP TABLE IF EXISTS events;

CREATE TABLE IF NOT EXISTS events (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  modality VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_events_project_id (project_id ASC) VISIBLE,
  CONSTRAINT event_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE EXTENSION_LINES
-- -----------------------------------------------------
DROP TABLE IF EXISTS extension_lines;

CREATE TABLE IF NOT EXISTS extension_lines (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  number INT(11) NOT NULL,
  name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  operation LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE EVALUATIONS
-- -----------------------------------------------------
DROP TABLE IF EXISTS evaluations;

CREATE TABLE IF NOT EXISTS evaluations (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  description LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX evaluations_fk_projects (project_id ASC) VISIBLE,
  CONSTRAINT evaluations_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE FUTURE_DEVELOPMENT_PLANS
-- -----------------------------------------------------
DROP TABLE IF EXISTS future_development_plans;

CREATE TABLE IF NOT EXISTS future_development_plans (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  activities LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  expected_results LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  participants_number VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_future_development_plans_project_id (project_id ASC) VISIBLE,
  CONSTRAINT future_development_plans_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PARTNERS
-- -----------------------------------------------------
DROP TABLE IF EXISTS partners;

CREATE TABLE IF NOT EXISTS partners (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  name VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  contact VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  email VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  phone VARCHAR(20) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_partners_project_id (project_id ASC) VISIBLE,
  UNIQUE INDEX uk_partners_email (email ASC) VISIBLE,
  CONSTRAINT partners_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE KNOWLEDGE_AREAS
-- -----------------------------------------------------
DROP TABLE IF EXISTS knowledge_areas;

CREATE TABLE IF NOT EXISTS knowledge_areas (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE DEMANDS
-- -----------------------------------------------------
DROP TABLE IF EXISTS demands;

CREATE TABLE IF NOT EXISTS demands (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  description VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  justification LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_demands_project_id (project_id ASC) VISIBLE,
  CONSTRAINT demands_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PUBLICATIONS
-- -----------------------------------------------------
DROP TABLE IF EXISTS publications;

CREATE TABLE IF NOT EXISTS publications (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  attachment_id BIGINT(20) UNSIGNED NOT NULL,
  type VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL DEFAULT 'ARTIGO',
  title VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  journal_name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  link VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_publications_project_id (project_id ASC) VISIBLE,
  INDEX idx_publications_attachment_id (attachment_id ASC) VISIBLE,
  CONSTRAINT publications_fk_attachments
    FOREIGN KEY (attachment_id)
    REFERENCES attachments (id),
  CONSTRAINT publications_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PROJECT_ATTACHMENTS
-- -----------------------------------------------------
DROP TABLE IF EXISTS project_attachments;

CREATE TABLE IF NOT EXISTS project_attachments (
  project_id BIGINT(20) UNSIGNED NOT NULL,
  attachment_id BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (project_id, attachment_id),
  INDEX idx_project_attachments_project_id (project_id ASC) VISIBLE,
  INDEX idx_project_attachments_attachment_id (attachment_id ASC) VISIBLE,
  CONSTRAINT project_attachments_fk_attachments
    FOREIGN KEY (attachment_id)
    REFERENCES attachments (id),
  CONSTRAINT project_attachments_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PROJECT_EXTENSION_LINES
-- -----------------------------------------------------
DROP TABLE IF EXISTS project_extension_lines;

CREATE TABLE IF NOT EXISTS project_extension_lines (
  project_id BIGINT(20) UNSIGNED NOT NULL,
  extension_line_id BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (project_id, extension_line_id),
  INDEX idx_project_extension_lines_project_id (project_id ASC) VISIBLE,
  INDEX idx_project_extension_lines_extension_line_id (extension_line_id ASC) VISIBLE,
  CONSTRAINT project_extension_lines_fk_extension_lines
    FOREIGN KEY (extension_line_id)
    REFERENCES extension_lines (id),
  CONSTRAINT project_extension_lines_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PROJECT_HUMAN_RESOURCES
-- -----------------------------------------------------
DROP TABLE IF EXISTS project_human_resources;

CREATE TABLE IF NOT EXISTS project_human_resources (
  project_id BIGINT(20) UNSIGNED NOT NULL,
  user_id BIGINT(20) UNSIGNED NOT NULL,
  coordinate TINYINT(1) NOT NULL DEFAULT 0,
  exclusive TINYINT(1) NOT NULL DEFAULT 0,
  workload INT(11) NOT NULL,
  dt_admission DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  INDEX idx_project_human_resources_project_id (project_id ASC) VISIBLE,
  INDEX idx_project_human_resources_user_id (user_id ASC) VISIBLE,
  PRIMARY KEY (project_id, user_id),
  CONSTRAINT project_human_resources_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT project_human_resources_fk_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PROJECT_KNOWLEDGE_AREAS
-- -----------------------------------------------------
DROP TABLE IF EXISTS project_knowledge_areas;

CREATE TABLE IF NOT EXISTS project_knowledge_areas (
  project_id BIGINT(20) UNSIGNED NOT NULL,
  knowledge_area_id BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (project_id, knowledge_area_id),
  INDEX idx_project_knowledge_areas_project_id (project_id ASC) VISIBLE,
  INDEX idx_project_knowledge_areas_knowledge_area_id (knowledge_area_id ASC) VISIBLE,
  CONSTRAINT project_knowledge_areas_fk_knowledge_areas
    FOREIGN KEY (knowledge_area_id)
    REFERENCES knowledge_areas (id),
  CONSTRAINT project_knowledge_areas_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PUBLICS
-- -----------------------------------------------------
DROP TABLE IF EXISTS publics;

CREATE TABLE IF NOT EXISTS publics (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  cras VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PROJECT_PUBLICS
-- -----------------------------------------------------
DROP TABLE IF EXISTS project_publics;

CREATE TABLE IF NOT EXISTS project_publics (
  project_id BIGINT(20) UNSIGNED NOT NULL,
  public_id BIGINT(20) UNSIGNED NOT NULL,
  directly TINYINT(1) NOT NULL DEFAULT 0,
  others_title VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  others_cras VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (project_id, public_id),
  INDEX idx_project_publics_project_id (project_id ASC) VISIBLE,
  INDEX idx_project_publics_public_id (public_id ASC) VISIBLE,
  CONSTRAINT project_publics_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id),
  CONSTRAINT project_publics_fk_publics
    FOREIGN KEY (public_id)
    REFERENCES publics (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE TARGETS
-- -----------------------------------------------------
DROP TABLE IF EXISTS targets;

CREATE TABLE IF NOT EXISTS targets (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  age_range VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  men_number INT(11) NULL DEFAULT 0,
  women_number INT(11) NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_targets_project_id (project_id ASC) VISIBLE,
  CONSTRAINT targets_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE THEME_AREAS
-- -----------------------------------------------------
DROP TABLE IF EXISTS theme_areas;

CREATE TABLE IF NOT EXISTS theme_areas (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE PROJECT_THEME_AREAS
-- -----------------------------------------------------
DROP TABLE IF EXISTS project_theme_areas;

CREATE TABLE IF NOT EXISTS project_theme_areas (
  project_id BIGINT(20) UNSIGNED NOT NULL,
  theme_area_id BIGINT(20) UNSIGNED NOT NULL,
  main TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (project_id, theme_area_id),
  INDEX idx_project_theme_areas_project_id (project_id ASC) VISIBLE,
  INDEX idx_project_theme_areas_theme_area_id (theme_area_id ASC) VISIBLE,
  CONSTRAINT project_theme_areas_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id),
  CONSTRAINT project_theme_areas_fk_theme_areas
    FOREIGN KEY (theme_area_id)
    REFERENCES theme_areas (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE STUDENTS
-- -----------------------------------------------------
DROP TABLE IF EXISTS students;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT(20) UNSIGNED NOT NULL,
  code VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  course VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  period INT(11) NOT NULL,
  scholarship TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_students_user_id (user_id ASC) VISIBLE,
  CONSTRAINT students_fk_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- TABLE TARGETS
-- -----------------------------------------------------
DROP TABLE IF EXISTS targets;

CREATE TABLE IF NOT EXISTS targets (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT(20) UNSIGNED NOT NULL,
  age_range VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  men_number INT(11) NULL DEFAULT 0,
  women_number INT(11) NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_targets_project_id (project_id ASC) VISIBLE,
  CONSTRAINT targets_fk_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (id))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
