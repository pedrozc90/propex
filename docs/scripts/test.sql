-- SELECT att.*, p.title FROM attachments att
-- INNER JOIN project_attachments pa ON pa.attachment_id = att.id
-- INNER JOIN projects p ON p.id = pa.project_id
-- WHERE p.id = 1;


-- SELECT att.*, p.title
-- FROM attachments att
-- LEFT JOIN project_attachments p_att ON LEFT JOIN projects p ON  AND (p.id = 1);

SELECT ta.* FROM theme_areas ta LEFT JOIN project_theme_areas pta ON pta.theme_area_id=ta.id WHERE pta.project_id = 1 AND pta.main = 1;