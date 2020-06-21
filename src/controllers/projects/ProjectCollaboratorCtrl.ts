import { isBoolean } from "@tsed/core";
import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, $log, MergeParams, UseBeforeEach } from "@tsed/common";
import { NotImplemented } from "@tsed/exceptions";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { CollaboratorRepository, ProjectRepository } from "../../repositories";
import { Collaborator } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/collaborators")
@MergeParams(true)
export class ProjectCollaboratorCtrl {

    constructor(private collaboratorRepository: CollaboratorRepository, private projectRepository: ProjectRepository) {}

    /**
     * Returns a list of collaborators working in a project.
     * @param projectId                     -- project id.
     * @param coordinate                    -- mark if collaborator is a project coordinator.
     * @param exclusive                     -- mark if collaborator is exclusive of the project.
     * @param q                             -- search query.
     */
    @Get("")
    @Authenticated({})
    public async getCollaborators(
        @PathParams("projectId") projectId: number,
        @QueryParams("coordinate") coordinate?: boolean,
        @QueryParams("exclusive") exclusive?: boolean,
        @QueryParams("q") q?: string
    ): Promise<Collaborator[]> {
        const query = this.collaboratorRepository.createQueryBuilder("clb")
            .innerJoinAndSelect("clb.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr", "phr.project_id = :projectId", { projectId });
            // .innerJoin("phr.project", "p", "p.id = :projectId", { projectId });
        
        if (isBoolean(coordinate)) {
            query.where("phr.coordinate = :coordinate", { coordinate: (coordinate) ? 1 : 0 });
        }
        
        if (isBoolean(exclusive)) {
            query.where("phr.exclusive = :exclusive", { exclusive: (exclusive) ? 1 : 0 });
        }

        if (q) {
            query.where("std.academic_function LIKE :function", { function: `%${q}%` })
                .orWhere("std.profissional_registry LIKE :registry", { registry: `%${q}%` })
                .orWhere("std.affiliation LIKE :affiliation", { affiliation: `%${q}%` })
                .orWhere("usr.name LIKE :name", { name: `%${q}%` })
                .orWhere("usr.email LIKE :email", { email: `%${q}%` });
        }

        console.log(query.getQueryAndParameters());

        return query.getMany();
    }

    @Post("")
    @Authenticated({})
    public async postCollaborators(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("collaborators") collaborators: Collaborator[]
    ): Promise<any> {
        const project = await this.projectRepository.findByContext(projectId, context);

        $log.debug(project, collaborators);

        throw new NotImplemented("Method Not Implemented.");
    }

}
