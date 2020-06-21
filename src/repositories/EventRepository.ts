import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Event, Page } from "../entities";

import { StringUtils } from "../core/utils";

@EntityRepository(Event)
export class EventRepository extends GenericRepository<Event> {

    constructor() {
        super([ "project" ]);
    }

    public async fetch(page: number = 1, rpp: number = 15, q?: string, projectId?: number): Promise<Page<Event>> {
        const query = this.createQueryBuilder("ep")
            .innerJoin("ep.project", "project");

        if (projectId) {
            query.where("project.id = :projectId", { projectId });
        }

        if (StringUtils.isNotEmpty(q)) {
            query.where("ep.name LIKE :name", { name: `%${q}%` })
                .orWhere("ep.modality LIKE :modality", { modality: `%${q}%` });
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Event>(await query.getMany(), page, rpp);
    }

}
