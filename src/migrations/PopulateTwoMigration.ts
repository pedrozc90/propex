import { MigrationInterface, QueryRunner } from "typeorm";

import { MigrationUtils } from "../core/utils";

const data: any[] = require("../../docs/scripts/data2.json");

export class PopulateTwoMigrationl1589006000000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
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
