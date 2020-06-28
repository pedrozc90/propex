import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";

import { Partner, Project } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

interface PartnerOptions extends IOptions {
    id?: number;
    name?: string;
    contact?: string;
    email?: string;
    phone?: string;
    project?: Project;
    projectId?: number;
}

@EntityRepository(Partner)
export class PartnerRepository extends GenericRepository<Partner> {

    /**
     * Return a list of partners.
     */
    public async fetch(params: PartnerOptions): Promise<Partner[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("pt");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("pt.project", "p", "p.id = :projectId", { projectId });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.where("pt.name LIKE :name", { name: `%${params.q}%` })
                .orWhere("pt.email LIKE :email", { email: `%${params.q}%` })
                .orWhere("pt.phone LIKE :phone", { phone: `%${params.q}%` });
        }

        if ((page && page > 0) && (rpp && rpp > 0)) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        query.orderBy({
            "pt.name": "ASC",
            "pt.id": "ASC"
        });

        return await query.getMany();
    }
    
    /**
     * Find a partner by id or email.
     * @param partner                       -- partner data.
     * @param project                       -- project data.
     */
    public async findMatch(partner: Partner, project?: Project): Promise<Partner | undefined> {
        return this.findOne({
            where: [
                { id: partner.id },
                { email: partner.email },
                { project: { id: project?.id } }
            ],
            join: {
                alias: "pt",
                innerJoin: { project: "pt.project" }
            }
        });
    }

}
