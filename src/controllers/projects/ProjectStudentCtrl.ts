import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";
import { NotImplemented, NotFound } from "@tsed/exceptions";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ProjectRepository, StudentRepository } from "../../repositories";
import { Student, Page } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/students")
@MergeParams(true)
export class ProjectStudentCtrl {

    constructor(
        private projectRepository: ProjectRepository,
        private studentRepository: StudentRepository) {
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
    @Authenticated({})
    public async getStudents(@Locals("context") context: Context,
        @PathParams("projectId") projectId: number,
        @QueryParams("scholarship") scholarship?: boolean,
        @QueryParams("period") period?: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 1,
        @QueryParams("q") q?: string
    ): Promise<Page<Student>> {
        // check if user is part of the current project
        const project = await this.projectRepository.findByContext(projectId, context);

        const students = await this.studentRepository.fetch({ page, rpp, q, projectId: project.id, period, scholarship });

        return Page.of<Student>(students, page, rpp);
    }

    @Post("")
    @Authenticated({})
    public async postStudents(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("student") student: Student
    ): Promise<any> {
        const project = await this.projectRepository.findByContext(projectId, context);

        const std = this.studentRepository.createQueryBuilder("std")
            .innerJoinAndSelect("std.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr")
            .innerJoin("phr.project", "p", "p.id = :projectId", { projectId: project.id })
            .where("std.id = :studentId", { studentId: student.id });
            // .orWhere("std.email = :email", { email: student.email })
        
        if (!std) {
            throw new NotFound("Student not found");
        }

        throw new NotImplemented("Method Not Implmented.");
    }

}
