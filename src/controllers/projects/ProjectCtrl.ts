import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Locals } from "@tsed/common";

import { ProjectRepository, ExtensionLineRepository } from "../../repositories";
import { Page, Project, ExtensionLine } from "../../entities";
import { IOptions, IContext, Scope } from "../../types";
import { CustomAuth } from "../../services";
import { Like } from "typeorm";

@Controller("/projects")
export class ProjectCtrl {

    constructor(private projectRepository: ProjectRepository,
        private extensionLineRepository: ExtensionLineRepository) {}

    @Get("/")
    @CustomAuth({ scope: [] })
    public async fetch(@Locals("context") context: IContext, @QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<Project>> {
        const options: IOptions = {};
        options.page = page || 1;
        options.rpp = rpp || 0;
        options.q = q || undefined;

        let query = await this.projectRepository.createQueryBuilder("p");

        query = query.innerJoinAndSelect("p.projectHumanResources", "phr")
            .innerJoinAndSelect("phr.user", "usr")
            .leftJoinAndSelect("usr.collaborator", "clb")
            .leftJoinAndSelect("usr.student", "std");

        if (context.scope !== Scope.ADMINISTRATOR) {
            query = query.where("usr.id = :userId", { userId: context.user?.id });
        }

        if (q) {
            query = query.where(`p.title like %${q}%`);
        }

        query = query.skip((page - 1) * rpp).take(rpp);

        return Page.of(await query.getMany(), page, rpp);
    }

    @Post("/")
    public async create(@BodyParams("project") project: Project): Promise<Project | undefined> {
        return this.projectRepository.save(project);
    }

    @Get("/list")
    @CustomAuth({ scope: [] })
    public async list(@Locals("context") context: IContext, @QueryParams("q") q: string): Promise<Project[]> {
        let query = await this.projectRepository.createQueryBuilder("p");
        
        query = query.innerJoinAndSelect("p.projectHumanResources", "phr")
            .innerJoinAndSelect("phr.user", "usr")
            .leftJoinAndSelect("usr.collaborator", "clb")
            .leftJoinAndSelect("usr.student", "std");

        if (context?.scope !== Scope.ADMINISTRATOR) {
            query = query.where("usr.id = :userId", { userId: context.user?.id });
        }

        if (q) {
            query = query.where(`p.title like %${q}%`);
        }

        return query.getMany();
    }

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Project | undefined> {
        return this.projectRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.projectRepository.deleteById(id);
    }

    @Get("/:id/extension-lines")
    public async getExtensionLines(@PathParams("id") id: number): Promise<ExtensionLine[] | undefined> {
        return this.extensionLineRepository.find({
            join: {
                alias: "el",
                innerJoin: { project: "el.projects" }
            },
            where: { project: { id } }
        });
    }

}
