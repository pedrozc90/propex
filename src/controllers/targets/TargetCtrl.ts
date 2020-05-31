import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, $log } from "@tsed/common";
import { Exception, NotImplemented } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import { TargetRepository, ProjectRepository } from "../../repositories";
import { Target } from "../../entities";
import { IContext, AgeRange } from "../../types";

@Controller("/targets")
export class TargetCtrl {

    constructor(private targetRepository: TargetRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of targets.
     */
    @Get("/")
    @CustomAuth({})
    public async fetch(): Promise<Target[]> {
        const query = this.targetRepository.createQueryBuilder("t");
        return query.getMany();
    }

    /**
     * Create/Update a target.
     * @param context                       -- user context.
     * @param target                        -- target data.
     */
    @Post("/")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("target") target: Target
    ): Promise<any> {
        // check if user is part of project.
        // const project = await this.projectRepository.findByContext(target.project.id, context);
        // if (!project) {
        //     throw new Exception(400, "Project not found.");
        // }
        // target.project = project;
        // return this.targetRepository.save(target);
        throw new NotImplemented("Method Not Implemented");
    }

    /**
     * Return a list of targets.
     */
    @Get("/age-ranges")
    @CustomAuth({})
    public async listTypes(): Promise<AgeRange[]> {
        return AgeRange.list;
    }

    /**
     * Search for target information by id.
     * @param id                            -- target id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<Target | undefined> {
        return this.targetRepository.findById(id);
    }

    /**
     * Delete a target information.
     * @param id                            -- target id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.targetRepository.deleteById(id);
    }

}
