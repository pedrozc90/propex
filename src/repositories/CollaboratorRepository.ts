import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Collaborator, Project } from "../entities";
import { IOptions } from "../core/types";
import { StringUtils } from "../core/utils";

interface CollaboratorOptions extends IOptions {
    id?: number;
    project?: Project;
    projectId?: number;
    coordinate?: boolean;
    exclusive?: boolean;
}

@EntityRepository(Collaborator)
export class CollaboratorRepository extends GenericRepository<Collaborator> {

    public async fetch(params: CollaboratorOptions): Promise<Collaborator[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("clb")
            .innerJoinAndSelect("clb.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr");
        
        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("phr.project", "p", "p.id = :projectId", { projectId });
        }
        
        if (isBoolean(params.coordinate)) {
            query.where("phr.coordinate = :coordinate", { coordinate: (params.coordinate) ? 1 : 0 });
        }
        
        if (isBoolean(params.exclusive)) {
            query.where("phr.exclusive = :exclusive", { exclusive: (params.exclusive) ? 1 : 0 });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.where("std.academic_function LIKE :function", { function: `%${params.q}%` })
                .orWhere("std.profissional_registry LIKE :registry", { registry: `%${params.q}%` })
                .orWhere("std.affiliation LIKE :affiliation", { affiliation: `%${params.q}%` })
                .orWhere("usr.name LIKE :name", { name: `%${params.q}%` })
                .orWhere("usr.email LIKE :email", { email: `%${params.q}%` });
        }

        if ((page && page > 0) && (rpp && rpp > 0)) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return query.getMany();
    }

}
