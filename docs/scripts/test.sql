SELECT `pb`.`created_at` AS `pb_created_at`,
 `pb`.`updated_at` AS `pb_updated_at`,
 `pb`.`project_id` AS `pb_project_id`,
 `pb`.`public_id` AS `pb_public_id`,
 `pb`.`directly` AS `pb_directly`,
 `pb`.`others_title` AS `pb_others_title`,
 `pb`.`others_cras` AS `pb_others_cras`,
 `public`.`created_at` AS `public_created_at`,
 `public`.`updated_at` AS `public_updated_at`,
 `public`.`id` AS `public_id`,
 `public`.`name` AS `public_name`,
 `public`.`customizable` AS `public_customizable`,
 `public`.`cras` AS `public_cras`,
 `public`.`deleted_at` AS `public_deleted_at`
  FROM `project_publics` `pb`
  INNER JOIN `publics` `public` ON `public`.`id`=`pb`.`public_id`
  WHERE pb.project_id = 1