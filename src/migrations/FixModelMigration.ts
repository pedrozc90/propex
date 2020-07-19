import { MigrationInterface, QueryRunner } from "typeorm";

export class FixModelMigration1589001000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const tables = [
            "activities",
            "attachments",
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
            "theme_areas",
            "users"
        ];
        
        // for (const t of tables) {
        //     await queryRunner.query(`ALTER TABLE ${t} MODIFY updated_at TIMESTAMP(6) DEFAULT NULL`);
        //     await queryRunner.query(`ALTER TABLE ${t} ALTER COLUMN updated_at DROP DEFAULT`);
        //     // await queryRunner.query(`ALTER TABLE ${t} ALTER COLUMN updated_at DEFAULT NULL`);
        // }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}

}
