import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams } from "@tsed/common";

import { ProjectRepository } from "../../repositories";
import { Page, Project } from "../../entities";
import { IOptions, UserRole } from "../../types";
import { CustomAuth } from "../../services";

@Controller("/project")
export class ProjectCtrl {

    constructor(private projectRepository: ProjectRepository) {}

    @Get("/")
    @CustomAuth({ scope: [] })
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<Project>> {
        const options: IOptions = {};
        options.page = page || 1;
        options.rpp = rpp || 0;
        options.q = q || undefined;

        return this.projectRepository.fetch({ ...options });
    }

    @Get("/list")
    public async list(@QueryParams("q") q: string): Promise<Project[]> {
        return this.projectRepository.list({ q });
    }

    @Post("")
    public async create(@BodyParams("project") project: Project): Promise<Project | undefined> {
        return this.projectRepository.save(project);
    }

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Project | undefined> {
        return this.projectRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.projectRepository.delete(id);
    }

}
