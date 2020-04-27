import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Locals } from "@tsed/common";

import { ProjectRepository } from "../../repositories";
import { Page, Project } from "../../entities";
import { IOptions, IContext } from "../../types";
import { CustomAuth } from "../../services";

@Controller("/projects")
export class ProjectCtrl {

    constructor(private projectRepository: ProjectRepository) {}

    @Get("/")
    @CustomAuth({ scope: [] })
    public async fetch(@Locals("context") context: IContext, @QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<Project>> {
        const options: IOptions = {};
        options.page = page || 1;
        options.rpp = rpp || 0;
        options.q = q || undefined;

        let query = await this.projectRepository.createQueryBuilder("p");
            
        if (q) {
            query = query.where(`p.title like %${q}%`);
        }

        query = query.innerJoinAndSelect("p.projectHumanResources", "phr");

        if (context.collaborator) {
            query = query.innerJoinAndSelect("prh.collaborator", "c")
                .innerJoin("c.user", "u", "u.id = :userId", { userId: context.user?.id });
        }

        if (context.student) {
            query = query.innerJoinAndSelect("prh.student", "s")
                .innerJoin("s.user", "u", "u.id = :userId", { userId: context.user?.id });
        }

        query = query.skip((page - 1) * rpp).take(rpp);

        return Page.of(await query.getMany(), page, rpp);
    }

    @Post("/")
    public async create(@BodyParams("project") project: Project): Promise<Project | undefined> {
        return this.projectRepository.save(project);
    }

    @Get("/list")
    public async list(@QueryParams("q") q: string): Promise<Project[]> {
        return this.projectRepository.list({ q });
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
