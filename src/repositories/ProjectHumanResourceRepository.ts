import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectHumanResource, Project, User } from "../entities";
import { IOptions, Scope } from "../core/types";

import { StringUtils } from "../core/utils";

interface HumanResourcesOptions extends IOptions {
    coordinate?: boolean;
    exclusive?: boolean;
    project?: Project;
    projectId?: number;
    user?: User;
    userId?: number;
    role?: Scope;
    scholarship?: boolean;
}

@EntityRepository(ProjectHumanResource)
export class ProjectHumanResourceRepository extends GenericRepository<ProjectHumanResource> {

    public async fetch(params: HumanResourcesOptions): Promise<{ list: ProjectHumanResource[], count: number }> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("phr")
            .innerJoinAndSelect("phr.user", "usr");
            
        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.andWhere("phr.project_id = :projectId", { projectId });
        }

        if (params.user || params.userId) {
            const userId = params.userId || params.user?.id;
            query.andWhere("phr.user_id = :userId", { userId });
        }
        
        if (isBoolean(params.coordinate)) {
            query.andWhere("phr.coordinate = :coordinate", { coordinate: (params.coordinate) ? 1 : 0 });
        }

        if (isBoolean(params.exclusive)) {
            query.andWhere("phr.exclusive = :exclusive", { exclusive: (params.exclusive) ? 1 : 0 });
        }

        if (params.role) {
            query.andWhere("usr.role = :role", { role: params.role.key });
        }

        if (isBoolean(params.scholarship)) {
            query.andWhere("phr.scholarship = :scholarship", { scholarship: (params.scholarship) ? 1 : 0 });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.andWhere("(usr.code LIKE :code OR usr.email LIKE :email OR usr.name LIKE :name)", {
                code: `%${params.q}%`,
                email: `%${params.q}%`,
                name: `%${params.q}%`
            });
        }

        query.orderBy("phr.coordinate", "ASC");

        const count = await query.getCount();

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return { list: await query.getMany(), count };
    }

}
