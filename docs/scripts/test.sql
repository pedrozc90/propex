-- select * from disclosure_medias dm
--     inner join projects p on p.id = dm.project_id
--     inner join project_human_resources phr on phr.project_id = p.id
--     inner join users usr on usr.id = phr.user_id
--     where dm.project_id = 1;

-- select * from disclosure_medias;

select * from project_human_resources phr;

select phr.project_id from project_human_resources phr where phr.user_id = 2;