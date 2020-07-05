import { Controller, Get, PathParams, Required, Post, BodyParams, QueryParams } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { StudentRepository } from "../../repositories";
import { Student, ResultContent, Page } from "../../entities";

@Controller("/students")
export class StudentCtrl {

    constructor(
        private studentRepository: StudentRepository) {
        // initialize your stuffs here
    }

    /**
     * Return a paginates list of students.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string.
     * @param projectId                     -- project id.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Student>> {
        const students = await this.studentRepository.fetch({ page, rpp, q, projectId });
        return Page.of<Student>(students, page, rpp);
    }

    /**
     * Create/Update a student.
     * @param context                       -- user context.
     * @param student                       -- student data.
     */
    @Post("")
    @Authenticated({})
    public async save(@Required() @BodyParams("student") student: Student): Promise<ResultContent<Student>> {
        let std = await this.studentRepository.findById(student.id);
        if (!std) {
            std = this.studentRepository.create(student);
        } else {
            std = this.studentRepository.merge(std, student);
        }
        std = await this.studentRepository.save(std);

        return ResultContent.of<Student>(std).withMessage("Student successfully saved.");
    }

    /**
     * Search for student information by id.
     * @param id                            -- student id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Student | undefined> {
        const student = await this.studentRepository.findById(id);
        if (!student) {
            throw new NotFound("Student not found.");
        }
        return student;
    }

}
