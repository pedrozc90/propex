import { MigrationInterface, QueryRunner } from "typeorm";

import { MigrationUtils } from "../core/utils";

const data: any[] = require("../../docs/scripts/data.json");

export class PopulateMigrationl1589005000000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        for (const table in data) {
            const query = MigrationUtils.buildInsertQuery(table, (data as any)[table]);
            for (const q of query) {
                await queryRunner.query(q);
            }
        }
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        // do nothing
    }

}
