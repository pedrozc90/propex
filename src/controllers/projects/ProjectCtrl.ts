import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Locals, Required } from "@tsed/common";

import { ProjectRepository, ExtensionLineRepository, KnowledgeAreaRepository, ThemeAreaRepository } from "../../repositories";
import { Page, Project, ExtensionLine, KnowledgeArea } from "../../entities";
import { IOptions, IContext, Scope } from "../../types";
import { CustomAuth } from "../../services";
import { HTTPException } from "ts-httpexceptions";

@Controller("/projects")
export class ProjectCtrl {

    constructor(private projectRepository: ProjectRepository,
        private extensionLineRepository: ExtensionLineRepository,
        private knowledgeAreaRepository: KnowledgeAreaRepository,
        private themeAreaRepository: ThemeAreaRepository) {}

    @Get("/")
    @CustomAuth({ scope: [] })
    public async fetch(@Locals("context") context: IContext, @QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<Project>> {
        const options: IOptions = {};
        options.page = page || 1;
        options.rpp = rpp || 0;
        options.q = q || undefined;

        let query = await this.projectRepository.createQueryBuilder("p");

        query = query.leftJoinAndSelect("p.projectHumanResources", "phr")
            .innerJoin("phr.user", "usr")
            .leftJoin("usr.collaborator", "clb")
            .leftJoin("usr.student", "std");

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
        if (project.projectHumanResources) {
            project.projectHumanResources.map((phr) => {
                console.log(phr);
            });
        }
        console.log(project);
        // const x = await this.projectRepository.save(project);
        // return x;
        return this.projectRepository.findOne({ id: 1000 });
    }

    @Get("/:id")
    @CustomAuth({ scope: [] })
    public async get(@Locals("context") context: IContext, @PathParams("id") id: number): Promise<Project | undefined> {
        let query = await this.projectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.activities", "activities")
            .leftJoinAndSelect("p.attachments", "attachments")
            .leftJoinAndSelect("p.demands", "demands")
            .leftJoinAndSelect("p.disclosureMedias", "disclosureMedias")
            .leftJoinAndSelect("p.evaluations", "evaluations")
            .leftJoinAndSelect("p.eventPresentations", "eventPresentations")
            .leftJoinAndSelect("p.extensionLines", "extensionLines")
            .leftJoinAndSelect("p.futureDevelopmentPlans", "futureDevelopmentPlans")
            .leftJoinAndSelect("p.knowledgeAreas", "knowledgeAreas")
            .leftJoinAndSelect("p.partners", "partners")
            .leftJoinAndSelect("p.projectTargets", "projectTargets")

            // load public
            .leftJoinAndSelect("p.projectPublics", "projectPublics")
            .leftJoinAndSelect("projectPublics.public", "public")

            // load theme areas
            .leftJoinAndSelect("p.projectThemeAreas", "projectThemeAreas")
            .leftJoinAndSelect("projectThemeAreas.themeArea", "themeArea")

            .leftJoinAndSelect("p.publications", "publications")
            
            // load human resouces (collaborators and students)
            .leftJoinAndSelect("p.projectHumanResources", "projectHumanResources")
            .leftJoinAndSelect("projectHumanResources.user", "user")
            .leftJoinAndSelect("user.collaborator", "collaborator")
            .leftJoinAndSelect("user.student", "student")
            .where("p.id = :id", { id });

        if (context.scope !== Scope.ADMINISTRATOR) {
            query = query.where("user.id = :userId", { userId: context.user?.id });
        }

        return query.getOne();
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

    @Post("/:id/extension-lines")
    public async setExtensionLines(@PathParams("id") id: number, @Required() @BodyParams("entensionLines") entensionLines: ExtensionLine[]): Promise<void> {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, `Project ${id} do not exists!`);
        }
        return this.projectRepository.createQueryBuilder("project")
            .relation("extensionLines").of(project).add(entensionLines);
    }

    @Get("/:id/knowledge-areas")
    public async getKnowledgeAreas(@PathParams("id") id: number): Promise<any> {
        return this.knowledgeAreaRepository.find({
            join: {
                alias: "ka",
                innerJoin: { project: "ka.projects" }
            },
            where: { project: { id } }
        });
    }

    @Get("/:id/theme-areas")
    public async getThemeAreas(@PathParams("id") id: number): Promise<any> {
        return this.themeAreaRepository.find({
            join: {
                alias: "ta",
                innerJoin: {
                    projectThemeArea: "ta.projectThemeAreas",
                    project: "projectThemeArea.project"
                }
            },
            where: { project: { id } },
            relations: [ "projectThemeAreas" ]
        });
    }

    // @Get("/:id/test")
    // public async getTest(@PathParams("id") id: number): Promise<any> {
    //     return this.projectRepository.find({
    //         join: {
    //             alias: "p",
    //             leftJoinAndSelect: {
    //                 projectThemeArea: "p.projectThemeAreas",
    //                 themeArea: "projectThemeArea.themeArea"
    //             }
    //         },
    //         where: { id }
    //     });
    // }

}
