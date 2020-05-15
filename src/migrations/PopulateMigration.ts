import { MigrationInterface, QueryRunner } from "typeorm";

const { users, knowledgeAreas, themeAreas, extensionLines, publics } = require("../../docs/scripts/data.json");

export class PopulateMigrationl1589005000000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        users.map((u: any) => {
            queryRunner.query(`INSERT INTO users (name, email, password, phone) VALUES (${u.name}, ${u.email}, ${u.password}, ${u.phone})`);
        });

        knowledgeAreas.map((ka: any) => {
            queryRunner.query(`INSERT INTO knowledge_areas (name) VALUES (${ka.name})`);
        });

        themeAreas.map((ta: any) => {
            queryRunner.query(`INSERT INTO theme_areas (name) VALUES (${ta.name})`);
        });

        extensionLines.map((el: any) => {
            queryRunner.query(`INSERT INTO extension_lines (number, name, operation) VALUES (${el.number}, ${el.name}, ${el.operation})`);
        });

        publics.map((p: any) => {
            queryRunner.query(`INSERT INTO publics (name) VALUES (${p.name})`);
        });
    }

    async down(queryRunner: QueryRunner): Promise<void> {}

}
