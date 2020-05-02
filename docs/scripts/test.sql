-- -----------------------------------------------------
-- TESTING
-- -----------------------------------------------------
INSERT INTO projects (title, program, start_season, included_courses, ppc_and_course_calendar, required_courses_credits, infrastructure, public_participation, accompaniment_and_evaluation) VALUES
    ("Projeto Teste 1", "Atividade Avaliativa", "2020/01", "Ciências da Computação", "???", "Engenharia de Software I, Engenharia de Software II", "???", "Nenhuma", "Excelente"),
    ("Projeto Teste 2", "Atividade Avaliativa", "2020/01", "Ciências da Computação", "???", "Engenharia de Software I, Engenharia de Software II", "???", "Nenhuma", "Bom"),
    ("Projeto Teste 3", "Atividade Avaliativa", "2020/01", "Ciências da Computação", "???", "Engenharia de Software I, Engenharia de Software II", "???", "Nenhuma", "Ruim");

INSERT INTO project_targets (project_id, men_number, women_number, age_range) VALUES
    (1, 0, 0, "UNTIL_12"),
    (1, 0, 0, "UNTIL_18"),
    (1, 0, 0, "FROM_19_TO_25"),
    (1, 0, 0, "FROM_26_TO_30"),
    (1, 0, 0, "FROM_31_TO_50"),
    (1, 5, 6, "FROM_51_TO_60"),
    (1, 8, 8, "FROM_61_TO_70"),
    (1, 0, 0, "OLDER_THAN_70"),
    
    (2, 0, 0, "UNTIL_12"),
    (2, 0, 0, "UNTIL_18"),
    (2, 0, 5, "FROM_19_TO_25"),
    (2, 8, 0, "FROM_26_TO_30"),
    (2, 0, 9, "FROM_31_TO_50"),
    (2, 0, 0, "FROM_51_TO_60"),
    (2, 0, 0, "FROM_61_TO_70"),
    (2, 0, 0, "OLDER_THAN_70"),
    
    (3, 10, 0, "UNTIL_12"),
    (3, 17, 5, "UNTIL_18"),
    (3, 0, 0, "FROM_19_TO_25"),
    (3, 0, 0, "FROM_26_TO_30"),
    (3, 0, 0, "FROM_31_TO_50"),
    (3, 0, 0, "FROM_51_TO_60"),
    (3, 0, 0, "FROM_61_TO_70"),
    (3, 0, 0, "OLDER_THAN_70");

INSERT INTO project_publics (project_id, public_id, directly, others_title, others_cras) VALUES
    (1, 2, 0, NULL, NULL),
    (1, 8, 1, NULL, NULL),
    (1, 10, 0, NULL, NULL),

    (2, 7, 0, NULL, NULL),

    (3, 9, 1, NULL, NULL),
    (3, 15, 0, NULL, NULL);

INSERT INTO evaluations (project_id, description) VALUES
    (1, "Evaluation 01"),
    (1, "Evaluation 02"),
    (2, "Evaluation 03");

INSERT INTO event_presentations (project_id, name, modality, date) VALUES
    (1, "Event A", "A", "2020-01-01"),
    (1, "Event A", "B", "2020-01-02");

INSERT INTO demands (project_id, description, justification) VALUES
    (1, "Demand X", "Por que sim ..."),
    (1, "Demand Y", "Sei la..."),
    (2, "Demand Z", "Por que eu quero ..."),
    (3, "Demand W", "Vai saber ...");

INSERT INTO disclosure_medias (project_id, name, link, date) VALUES
    (1, "Media X", "http://www.medias/com/x", "2020-05-01"),
    (1, "Media Y", "http://www.medias/com/y", "2020-03-29");

INSERT INTO project_knowledge_areas (project_id, knowledge_area_id) VALUES
    (1, 3),
    (1, 4),
    (1, 1),
    (2, 2),
    (2, 3),
    (3, 5),
    (3, 6);

INSERT INTO project_theme_areas (project_id, theme_area_id, main) VALUES
    (1, 4, false),
    (1, 7, true),
    (1, 8, false),
    (2, 2, true),
    (3, 2, false),
    (3, 6, true);

INSERT INTO project_extension_lines (project_id, extension_line_id) VALUES
    (1, 6),
    (1, 2);

INSERT INTO partners (project_id, name, contact, email, phone) VALUES
    (1, "Partner A", "???", "partner01@email.com", "(48) 0000-0000"),
    (1, "Partner B", "???", "partner02@email.com", "(48) 0000-0001"),
    (1, "Partner B", "???", "partner03@email.com", "(48) 0000-0002");

INSERT INTO users (name, email, password, phone) VALUES
    ("user1", "user1@domain.com", "123456", "(48) 00000-0001"),
    ("user2", "user2@domain.com", "123456", "(48) 00000-0002"),
    ("user3", "user3@domain.com", "123456", "(48) 00000-0003"),
    ("user4", "user4@domain.com", "123456", "(48) 00000-0004"),
    ("user5", "user5@domain.com", "123456", "(48) 00000-0005"),
    ("user6", "user6@domain.com", "123456", "(48) 00000-0006"),
    ("user7", "user7@domain.com", "123456", "(48) 00000-0007");

INSERT INTO collaborators (profissional_registry, affiliation, academic_function, user_id) VALUES 
    ("x000001", "A", "Professor", 2),
    ("x000002", "B", "Professor", 3),
    ("x000003", "C", "Professor", 4),
    ("x000004", "D", "Professor", 5);

INSERT INTO students (code, course, period, scholarship, user_id) VALUES 
    ("y000001", "Ciências da Computação", 6, false, 6),
    ("y000002", "Ciências da Computação", 7, true, 7),
    ("y000003", "Ciências da Computação", 7, true, 8);

INSERT INTO project_human_resources (project_id, user_id, coordinate, exclusive, workload, dt_admission) VALUES
    (1, 2, 1, 0, 48, "2020-01-01"),
    (2, 3, 1, 1, 48, "2020-01-01"),
    (3, 4, 1, 1, 48, "2020-01-01"),
    
    (1, 5, 0, 1, 36, "2020-02-01"),

    (1, 6, 0, 0, 12, "2020-03-01"),
    (2, 7, 0, 0, 12, "2020-03-01"),
    (3, 8, 0, 0, 12, "2020-03-01");