import { MigrationInterface, QueryRunner } from "typeorm";

export class FixModel1589001000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const tables = [
            "activities",
            "attachments",
            "collaborators",
            "demands",
            "disclosure_medias",
            "evaluations",
            "event_presentations",
            "extension_lines",
            "future_development_plans",
            "knowledge_areas",
            "partners",
            "project_human_resources",
            "project_publics",
            "project_targets",
            "project_theme_areas",
            "projects",
            "publications",
            "publics",
            "students",
            "theme_areas",
            "users"
        ];
        
        Promise.all(tables.map((t: string) => {
            queryRunner.query(`ALTER TABLE ${t} MODIFY updated_at TIMESTAMP(6) DEFAULT NULL`);
            queryRunner.query(`ALTER TABLE ${t} ALTER COLUMN updated_at DROP DEFAULT`);
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}

}
