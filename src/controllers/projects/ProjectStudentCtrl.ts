import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, $log, MergeParams } from "@tsed/common";
import { NotImplemented } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Student } from "../../entities";
import { IContext } from "../../types";

@Controller("/:projectId/students")
@MergeParams(true)
export class ProjectStudentCtrl {

    constructor(
        private ProjectRepository: Repo.ProjectRepository,
        private StudentRepository: Repo.StudentRepository) {
        // initialize stuff here
    }

    /**
     * Returns a list of students working on this project.
     * @param id                -- project id.
     * @param scholarship       -- mark if student has a scholarship.
     * @param period            -- search for student from a specific period.
     * @param q                 -- search query.
     */
    @Get("")
    @CustomAuth({})
    public async getStudents(
        @PathParams("projectId") projectId: number,
        @QueryParams("scholarship") scholarship?: boolean,
        @QueryParams("period") period?: string,
        @QueryParams("q") q?: string
    ): Promise<Student[]> {
        let query = this.StudentRepository.createQueryBuilder("std")
            .innerJoinAndSelect("std.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr")
            .innerJoin("phr.project", "p", "p.id = :projectId", { projectId });
        
        if (scholarship !== undefined && scholarship !== null) {
            query = query.where("std.scholarship = :scholarship", { scholarship: (scholarship) ? 1 : 0 });
        }

        // NÃO FUNCIONA (???)
        if (period) {
            query = query.where(`std.period = '${period}'`);
        }

        if (q) {
            query = query.where(`std.code LIKE '%${q}%'`)
                .orWhere(`std.course LIKE '%${q}%'`)
                .orWhere(`usr.name LIKE '%${q}%'`);
        }

        return query.getMany();
    }

    @Post("")
    @CustomAuth({})
    public async postStudents(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("students") students: Student[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(projectId, context);

        $log.debug(project, students);

        throw new NotImplemented("Method Not Implmented.");
    }

}
