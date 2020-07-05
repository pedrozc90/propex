import { MigrationInterface, QueryRunner } from "typeorm";

const { users, collaborators, students, projects } = require("../../docs/scripts/data2.json");

export class PopulateTwoMigrationl1589006000000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        // populate tables
        for (const u of users) {
            await queryRunner.query(`INSERT INTO users (name, email, password, phone, role) VALUES ('${u.name}', '${u.email}', '${u.password}', '${u.phone}', '${u.role}')`);
        };

        for (const c of collaborators) {
            await queryRunner.query(`INSERT INTO collaborators (academic_function, profissional_registry, affiliation, user_id) VALUES ('${c.academicFunction}', '${c.profissionalRegistry}','${c.affiliation}', ${c.userId})`);
        }

        for (const s of students) {
            await queryRunner.query(`INSERT INTO students (code, course, period, scholarship, user_id) VALUES ('${s.code}', '${s.course}', '${s.period}', ${s.scholarship}, ${s.userId})`);
        };

        for (const p of projects) {
            await queryRunner.query(`INSERT INTO projects (title, program) VALUES ('${p.title}', '${p.program}')`);
        };

        await queryRunner.query(`INSERT INTO project_human_resources (project_id, user_id, coordinate, exclusive, workload, dt_admission) VALUES
            (1, 2, true , true , '24', '2020-01-01'),
            (1, 3, false, false,  '8', '2020-01-01'),
            (1, 4, true , true , '24', '2020-01-01'),
            (2, 5, true , true , '24', '2020-01-01'),
            (2, 6, false, false,  '8', '2020-01-01'),
            (2, 7, false, false,  '8', '2020-01-01'),
            (2, 8, false, false,  '8', '2020-01-01')`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {}

}
