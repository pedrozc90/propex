import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { DisclosureMedia, Project } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

interface DisclosureMediaOptions extends IOptions {
    id?: number;
    name?: string;
    link?: string;
    project?: Project;
    projectId?: number;
    from?: string;
    to?: string;
    date?: string;
}

@EntityRepository(DisclosureMedia)
export class DisclosureMediaRepository extends GenericRepository<DisclosureMedia> {

    /**
     * Return a paginated list of diclosure medias.
     * @param options                       -- options
     */
    public async fetch(params: DisclosureMediaOptions): Promise<DisclosureMedia[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("dm");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("dm.project", "p", "p.id = :projectId", { projectId });
        }
        
        if (StringUtils.isNotEmpty(params.q)) {
            query.where("dm.name LIKE :name", { name: `%${params.q}%` })
                .orWhere("dm.link LIKE :link", { link: `%${params.q}%` });
        }

        if (params.date) query.where("dm.date = :date", { date: params.date });
        if (params.from) query.where("dm.date >= :from", { from: params.from });
        if (params.to) query.where("dm.date <= :to", { tp: params.to });
        
        query.orderBy("dm.date", "DESC");

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }
        
        return await query.getMany();
    }

}
