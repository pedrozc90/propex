import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Locals, Required, $log } from "@tsed/common";

import * as Repo from "../../repositories";
import { Page, Project, ExtensionLine, ProjectHumanResource } from "../../entities";
import { IContext, Scope } from "../../types";
import { CustomAuth } from "../../services";
import { HTTPException, Unauthorized } from "ts-httpexceptions";

@Controller("/projects")
export class ProjectCtrl {

    constructor(
        private ActivityRepository: Repo.ActivityRepository,
        private AttachmentRepository: Repo.AttachmentRepository,
        private CollaboratorRepository: Repo.CollaboratorRepository,
        private DemandRepository: Repo.DemandRepository,
        private DisclosureMediaRepository: Repo.DisclosureMediaRepository,
        private EvaluationRepository: Repo.EvaluationRepository,
        private EventPresentationRepository: Repo.EventPresentationRepository,
        private ExtensionLineRepository: Repo.ExtensionLineRepository,
        private FutureDevelopmentPlanRepository: Repo.FutureDevelopmentPlanRepository,
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private PartnerRepository: Repo.PartnerRepository,
        private ProjectRepository: Repo.ProjectRepository,
        private ProjectHumanResourceRepository: Repo.ProjectHumanResourceRepository,
        private ProjectPublicRepository: Repo.ProjectPublicRepository,
        private ProjectTargetRepository: Repo.ProjectTargetRepository,
        private ProjectThemeAreaRepository: Repo.ProjectThemeAreaRepository,
        private PublicRepository: Repo.PublicRepository,
        private PublicationRepository: Repo.PublicationRepository,
        private StudentRepository: Repo.StudentRepository,
        private ThemeAreaRepository: Repo.ThemeAreaRepository,
        private UserRepository: Repo.UserRepository) {
        // initialize stuff here
    }

    @Get("/")
    @CustomAuth({ scope: [] })
    public async fetch(@Locals("context") context: IContext, @QueryParams("page") page: number = 1, @QueryParams("rpp") rpp: number = 15, @QueryParams("q") q: string): Promise<Page<Project>> {
        let query = await this.ProjectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.projectHumanResources", "phr")
            .innerJoin("phr.user", "usr")
            .leftJoin("usr.collaborator", "clb")
            .leftJoin("usr.student", "std");

        if (context.scope !== Scope.ADMINISTRATOR) {
            query = query.where((qb) => {
                const subquery = qb.subQuery().from(ProjectHumanResource, "x").select("x.project_id")
                    .where("x.user_id = :userId", { userId: context.user?.id })
                    .getQuery();
                return `p.id IN ${subquery}`;
            });
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
        // const x = await this.ProjectRepository.save(project);
        // return x;
        return this.ProjectRepository.findOne({ id: 1000 });
    }

    @Get("/:id")
    @CustomAuth({ scope: [] })
    public async get(@Locals("context") context: IContext, @PathParams("id") id: number): Promise<Project | undefined> {
        // check if user belong to this project.
        const { access } = await this.ProjectRepository.createQueryBuilder("p")
            .innerJoin("p.projectHumanResources", "phr", "phr.project_id = :projectId AND phr.user_id = :userId", { projectId: id, userId: context.user.id })
            .select("COUNT(p.id) > 0", "access")
            .getRawOne();
        if (context.scope !== Scope.ADMINISTRATOR && access === 0) {
            throw new Unauthorized("User do not have access to this project.");
        }

        const query = await this.ProjectRepository.createQueryBuilder("p")
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

            .leftJoinAndSelect("p.activities", "activities")
            .leftJoinAndSelect("p.attachments", "attachments")

            .leftJoinAndSelect("p.publications", "publications")
            .leftJoinAndSelect("publications.attachment", "publicationsAttachments")
            
            // load human resouces (collaborators and students)
            .leftJoinAndSelect("p.projectHumanResources", "projectHumanResources")
            .leftJoinAndSelect("projectHumanResources.user", "user")
            .leftJoinAndSelect("user.collaborator", "collaborator")
            .leftJoinAndSelect("user.student", "student")
            .where("p.id = :id", { id });

        return query.getOne();
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.ProjectRepository.deleteById(id);
    }

    @Get("/:id/extension-lines")
    public async getExtensionLines(@PathParams("id") id: number): Promise<ExtensionLine[] | undefined> {
        return this.ExtensionLineRepository.find({
            join: {
                alias: "el",
                innerJoin: { project: "el.projects" }
            },
            where: { project: { id } }
        });
    }

    @Post("/:id/extension-lines")
    public async setExtensionLines(@PathParams("id") id: number, @Required() @BodyParams("entensionLines") entensionLines: ExtensionLine[]): Promise<void> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, `Project ${id} do not exists!`);
        }
        return this.ProjectRepository.createQueryBuilder("project")
            .relation("extensionLines").of(project).add(entensionLines);
    }

    @Get("/:id/knowledge-areas")
    public async getKnowledgeAreas(@PathParams("id") id: number): Promise<any> {
        return this.KnowledgeAreaRepository.find({
            join: {
                alias: "ka",
                innerJoin: { project: "ka.projects" }
            },
            where: { project: { id } }
        });
    }

    @Get("/:id/publics")
    public async getPublics(@PathParams("id") id: number): Promise<any> {
        return this.PublicRepository.find({
            join: {
                alias: "public",
                innerJoin: {
                    projectPublic: "public.projectPublics",
                    project: "projectPublic.project"
                }
            },
            where: { project: { id } },
            relations: [ "projectPublics" ]
        });
    }

    @Get("/:id/theme-areas")
    public async getThemeAreas(@PathParams("id") id: number): Promise<any> {
        return this.ThemeAreaRepository.find({
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
    //     return this.ProjectRepository.find({
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
