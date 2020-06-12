import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, $log, MergeParams } from "@tsed/common";
import { NotImplemented } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Collaborator } from "../../entities";
import { IContext } from "../../types";
import { isBoolean } from "@tsed/core";

@Controller("/:projectId/collaborators")
@MergeParams(true)
export class ProjectCollaboratorCtrl {

    constructor(
        private CollaboratorRepository: Repo.CollaboratorRepository,
        private ProjectRepository: Repo.ProjectRepository) {
        // initialize stuff here
    }

    /**
     * Returns a list of collaborators working in a project.
     * @param projectId                     -- project id.
     * @param coordinate                    -- mark if collaborator is a project coordinator.
     * @param exclusive                     -- mark if collaborator is exclusive of the project.
     * @param q                             -- search query.
     */
    @Get("")
    @CustomAuth({})
    public async getCollaborators(
        @PathParams("projectId") projectId: number,
        @QueryParams("coordinate") coordinate?: boolean,
        @QueryParams("exclusive") exclusive?: boolean,
        @QueryParams("q") q?: string
    ): Promise<Collaborator[]> {
        let query = this.CollaboratorRepository.createQueryBuilder("clb")
            .innerJoinAndSelect("clb.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr", "phr.project_id = :projectId", { projectId });
            // .innerJoin("phr.project", "p", "p.id = :projectId", { projectId });
        
        if (isBoolean(coordinate)) {
            query = query.where("phr.coordinate = :coordinate", { coordinate: (coordinate) ? 1 : 0 });
        }
        
        if (isBoolean(exclusive)) {
            query = query.where("phr.exclusive = :exclusive", { exclusive: (exclusive) ? 1 : 0 });
        }

        if (q) {
            query = query.where("std.academic_function LIKE :function", { function: `%${q}%` })
                .orWhere("std.profissional_registry LIKE :registry", { registry: `%${q}%` })
                .orWhere("std.affiliation LIKE :affiliation", { affiliation: `%${q}%` })
                .orWhere("usr.name LIKE :name", { name: `%${q}%` })
                .orWhere("usr.email LIKE :email", { email: `%${q}%` });
        }

        console.log(query.getQueryAndParameters());

        return query.getMany();
    }

    @Post("")
    @CustomAuth({})
    public async postCollaborators(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("collaborators") collaborators: Collaborator[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(projectId, context);

        $log.debug(project, collaborators);

        throw new NotImplemented("Method Not Implemented.");
    }

}
