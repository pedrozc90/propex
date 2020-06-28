import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectHumanResource, Project, User } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

interface HumanResourcesOptions extends IOptions {
    coordinate?: boolean;
    exclusive?: boolean;
    project?: Project;
    projectId?: number;
    user?: User;
    userId?: number;
}

@EntityRepository(ProjectHumanResource)
export class ProjectHumanResourceRepository extends GenericRepository<ProjectHumanResource> {

    public async fetch(params: HumanResourcesOptions): Promise<ProjectHumanResource[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("phr")
            .innerJoinAndSelect("phr.user", "usr")
            .leftJoinAndSelect("usr.student", "std")
            .leftJoinAndSelect("usr.collaborator", "clb");
            
        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.where("phr.project_id = :projectId", { projectId });
        }

        if (params.user || params.userId) {
            const userId = params.userId || params.user?.id;
            query.where("phr.user_id = :userId", { userId });
        }
        
        if (isBoolean(params.coordinate)) {
            query.where("std.coordinate = :coordinate", { coordinate: (params.coordinate) ? 1 : 0 });
        }

        if (isBoolean(params.exclusive)) {
            query.where("phr.exclusive = :exclusive", { exclusive: (params.exclusive) ? 1 : 0 });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            // query.where("std.code LIKE :code", { code: `%${params.q}%` })
            //     .orWhere("std.course LIKE :course", { course: `%${params.q}%` })
            //     .orWhere("usr.name LIKE :name", { name: `%${params.q}%` });
        }

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return query.getMany();
    }

}
