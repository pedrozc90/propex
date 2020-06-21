import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { DisclosureMedia, Page } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";
import { Context } from "../core/models";

@EntityRepository(DisclosureMedia)
export class DisclosureMediaRepository extends GenericRepository<DisclosureMedia> {

    /**
     * Return a paginated list of diclosure medias.
     * @param options                       -- options
     */
    public async fetch(page: number = 1, rpp: number = 15, q?: string, date?: string, from?: string, to?: string, projectId?: number, context?: Context): Promise<Page<DisclosureMedia>> {
        const query = this.createQueryBuilder("dm")
            .innerJoin("dm.project", "p");
        
        if (StringUtils.isNotEmpty(q)) {
            query.where("dm.name LIKE :name", { name: `%${q}%` })
                .orWhere("dm.link LIKE :link", { link: `%${q}%` });
        }

        if (date) query.where("dm.date = :date", { date });
        if (from) query.where("dm.date >= :from", { from });
        if (to) query.where("dm.date <= :to", { to });
        if (projectId) query.where("p.id = :projectId", { projectId });

        query.orderBy("dm.date", "DESC")
            .skip((page - 1) * rpp)
            .take(rpp);
        
        return Page.of<DisclosureMedia>(await query.getMany(), page, rpp);
    }

}
