import { Controller, Locals, Get, Post, Put, QueryParams, PathParams, BodyParams, Required, $log } from "@tsed/common";
import { Exception, Unauthorized, BadRequest } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import * as Repo from "../../repositories";
import { Page, Project, ProjectBasic, ProjectHumanResource, User, ResultContent } from "../../entities";
import { Context } from "../../core/models";
import { Scope } from "../../core/types";

import { StringUtils } from "../../core/utils";

import { ProjectAttachmentCtrl } from "./ProjectAttachmentCtrl";
import { ProjectDemanCtrl } from "./ProjectDemanCtrl";
import { ProjectDisclosureMediaCtrl } from "./ProjectDisclosureMediaCtrl";
import { ProjectEvaluationCtrl } from "./ProjectEvaluationCtrl";
import { ProjectExtensionLineCtrl } from "./ProjectExtensionLineCtrl";
import { ProjectHumanResourcesCtrl } from "./ProjectHumanResourcesCtrl";
import { ProjectKnowledgeAreaCtrl } from "./ProjectKnowledgeAreaCtrl";
import { ProjectPartnerCtrl } from "./ProjectPartnerCtrl";
import { ProjectPublicCtrl } from "./ProjectPublicCtrl";
import { ProjectTargetCtrl } from "./ProjectTargetCtrl";
import { ProjectThemeAreaCtrl } from "./ProjectThemeAreaCtrl";

@Controller({
    path: "/projects",
    children: [
        ProjectAttachmentCtrl,
        ProjectDemanCtrl,
        ProjectDisclosureMediaCtrl,
        ProjectEvaluationCtrl,
        ProjectExtensionLineCtrl,
        ProjectHumanResourcesCtrl,
        ProjectKnowledgeAreaCtrl,
        ProjectPartnerCtrl,
        ProjectPublicCtrl,
        ProjectTargetCtrl,
        ProjectThemeAreaCtrl
    ]
})
export class ProjectCtrl {

    constructor(
        private ExtensionLineRepository: Repo.ExtensionLineRepository,
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private ProjectRepository: Repo.ProjectRepository,
        private ProjectHumanResourceRepository: Repo.ProjectHumanResourceRepository,
        private TargetRepository: Repo.TargetRepository,
        private UserRepository: Repo.UserRepository) {
        // initialize stuff here
    }

    /**
     * Return a paginated list of projects, which the user is associated with.
     * @param context                       -- user context.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string (search).
     */
    @Get("")
    @Authenticated({})
    public async fetch(@Locals("context") context: Context,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Project>> {
        const query = this.ProjectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.projectHumanResources", "phr")
            .leftJoinAndSelect("phr.user", "usr")
            .leftJoin("usr.collaborator", "clb")
            .leftJoin("usr.student", "std");

        if (context.scope !== Scope.ADMIN) {
            query.where((qb) => {
                const subquery = qb.subQuery().from(ProjectHumanResource, "hr").select("hr.project_id")
                    .where("hr.user_id = :userId", { userId: context.user?.id })
                    .getQuery();
                return `p.id IN ${subquery}`;
            });
        }

        if (StringUtils.isNotEmpty(q)) {
            query.where("p.title LIKE :title", { title: `%${q}%` })
                .orWhere("p.program LIKE :program", { program: `%${q}%` });
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Project>(await query.getMany(), page, rpp);
    }

    /**
     * Create a new project.
     * @param context                       -- user context.
     * @param project                       -- project data.
     */
    @Post("")
    @Authenticated({ scope: [ "ADMIN" ] })
    public async create(@Required() @BodyParams("project") data: ProjectBasic,
        @Required() @BodyParams("coordinator") coordinator: User
    ): Promise<ResultContent<any>> {
        if (!coordinator) {
            throw new BadRequest("Required coordinator was not send!");
        }
        
        const user = await this.UserRepository.findUserInfo({ id: coordinator.id, email: coordinator.email });
        if (!user) {
            throw new Exception(404, "Please, coodinator user is not registed.");
        }

        // create a new project
        let project = new Project();
        project.title = data.title;
        project.program = data.program;
        project = await this.ProjectRepository.save(project).catch((err: Error) => {
            throw new Exception(404, "Unable to save new project.", err);
        });
        
        // define user as project coordinator
        const phr = new ProjectHumanResource();
        phr.coordinate = true;
        phr.exclusive = true;
        phr.workload = 48;
        phr.project = project;
        phr.user = user;

        await this.ProjectHumanResourceRepository.save(phr)
            .catch((error: Error) => $log.error(error.message));

        // create the default targets for this project.
        const targets = this.TargetRepository.default(project);
        await this.TargetRepository.save(targets);

        return ResultContent.of({ id: project.id, title: project.title }).withMessage("Project successfully created!");
    }

    @Put("")
    @Authenticated({})
    public async update(
        @Locals("context") context: Context,
        @Required() @BodyParams("project") data: Project
    ): Promise<ResultContent<Project>> {
        // check if project exists.
        let project = await this.ProjectRepository.findByContext(data.id, context);

        // update project values
        project = this.ProjectRepository.merge(project, data);

        // update database
        project = await this.ProjectRepository.save(project);

        // update knowledge areas changes.
        if (data.knowledgeAreas) {
            await this.KnowledgeAreaRepository.overwrite(project, data.knowledgeAreas);
        }

        if (data.extensionLines) {
            // await this.ExtensionLineRepository.overwrite(project, data.knowledgeAreas);
        }

        return ResultContent.of<Project>(project).withMessage("Project successfully updated.");
    }

    /**
     * Search data of a given project.
     * @param context                       -- user context.
     * @param id                            -- project id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Locals("context") context: Context,
        @Required() @PathParams("id") id: number
    ): Promise<Project | undefined> {
        // check if user belong to this project.
        const { access } = await this.ProjectRepository.createQueryBuilder("p")
            .innerJoin("p.projectHumanResources", "phr", "phr.project_id = :projectId AND phr.user_id = :userId", { projectId: id, userId: context.user.id })
            .select("COUNT(p.id) > 0", "access")
            .getRawOne();
        
        // user need to be a administrator or need to be associate to the project.
        if (context.scope !== Scope.ADMIN && access === 0) {
            throw new Unauthorized("User do not have access to this project.");
        }

        // load project and all his relationships.
        const query = await this.ProjectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.demands", "d")
            .leftJoinAndSelect("p.disclosureMedias", "dm")
            .leftJoinAndSelect("p.evaluations", "ev")
            .leftJoinAndSelect("p.events", "evt")
            .leftJoinAndSelect("p.extensionLines", "el")
            .leftJoinAndSelect("p.futureDevelopmentPlans", "fdp")
            .leftJoinAndSelect("p.knowledgeAreas", "ka")
            .leftJoinAndSelect("p.partners", "prt")
            .leftJoinAndSelect("p.targets", "tgt")

            // load public
            .leftJoinAndSelect("p.projectPublics", "ppb")
            .leftJoinAndSelect("ppb.public", "pub")

            // load theme areas
            .leftJoinAndSelect("p.projectThemeAreas", "pta")
            .leftJoinAndSelect("pta.themeArea", "ta")

            .leftJoinAndSelect("p.activities", "act")
            .leftJoinAndSelect("p.attachments", "att")

            .leftJoinAndSelect("p.publications", "pb")
            .leftJoinAndSelect("pb.attachment", "pba")
            
            // load human resouces (collaborators and students)
            .leftJoinAndSelect("p.projectHumanResources", "phr")
            .leftJoinAndSelect("phr.user", "usr")
            .leftJoinAndSelect("usr.collaborator", "clb")
            .leftJoinAndSelect("usr.student", "std")
            .where("p.id = :id", { id });

        return query.getOne();
    }

}
