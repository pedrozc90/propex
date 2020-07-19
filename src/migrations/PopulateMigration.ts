import { MigrationInterface, QueryRunner } from "typeorm";

import { MigrationUtils } from "../core/utils";

const data: any[] = require("../../docs/scripts/data.json");

export class PopulateMigrationl1589005000000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        // populate tables
        // for (const u of users) {
        //     await queryRunner.query(`INSERT INTO users (name, email, password, phone, role, code)
        //         VALUES ('${u.name}', '${u.email}', '${u.password}', '${u.phone}', '${u.role}', '${u.code}')`);
        // };

        // for (const ka of knowledgeAreas) {
        //     await queryRunner.query(`INSERT INTO knowledge_areas (name) VALUES ('${ka.name}')`);
        // }

        // for (const ta of themeAreas) {
        //     await queryRunner.query(`INSERT INTO theme_areas (name) VALUES ('${ta.name}')`);
        // };

        // for (const el of extensionLines) {
        //     await queryRunner.query(`INSERT INTO extension_lines (number, name, operation) VALUES (${el.number}, '${el.name}', '${el.operation}')`);
        // };

        // for (const p of publics) {
        //     await queryRunner.query(`INSERT INTO publics (name, cras, customizable) VALUES ('${p.name}', '${p.cras}', ${(p.customizable) ? 1 : 0})`);
        // };
        for (const table in data) {
            const query = MigrationUtils.buildInsertQuery(table, (data as any)[table]);
            for (const q of query) {
                console.log(q);
                await queryRunner.query(q);
            }
        }
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        // do nothing
    }

}
