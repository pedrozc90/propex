select p.id, p.title, u.id from projects p
    inner join project_human_resources phr on phr.project_id = p.id
    inner join users u on u.id = phr.user_id
    left join students s on s.user_id = u.id
    left join collaborators c on c.user_id = u.id
    where p.id = 3;

-- select
--     u.id as user_id,
--     u.name,
--     u.email,
--     s.id as student_id,
--     c.id as collaborator_id
--     from users u
--     left join students s on s.user_id = u.id
--     left join collaborators c on c.user_id = u.id
--     where s.id is not null or c.id is not null;

-- select * from projects p2
--     where p2.id in (select p.id from projects p
--         left join project_human_resources phr on phr.project_id = p.id
--         left join users u on u.id = phr.user_id
--         where u.id = 6);

-- SELECT `a`.`id` AS `a_id` FROM `projects` `a` LEFT JOIN `project_human_resources` `b` ON `b`.`project_id`=`a`.`id`  LEFT JOIN `users` `c` ON `c`.`id`=`b`.`user_id` WHERE `c`.`id` = 6;
-- SELECT `a`.`id` AS `a_id` FROM `projects` `a` LEFT JOIN `project_human_resources` `b` ON `b`.`project_id`=`a`.`id`  LEFT JOIN `users` `c` ON `c`.`id`=`b`.`user_id` WHERE `c`.`id` = 6;