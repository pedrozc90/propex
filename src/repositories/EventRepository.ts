import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Event, Page } from "../entities";
import { IOptions } from "../core/types";

const relations = [ "project" ];

@EntityRepository(Event)
export class EventRepository extends GenericRepository<Event> {

    constructor() {
        super(relations);
    }

    public async fetch(options: IOptions): Promise<Page<Event>> {
        const page = options.page || 1;
        const rpp = options.rpp || 15;
        const q = options.q;
        const project = options.project;

        const query = this.createQueryBuilder("ep")
            .innerJoin("ep.project", "project");

        if (typeof project === "string") {
            query.where("project.title LIKE :title", { title: `%${project}%` });
        } else if (typeof project === "number") {
            query.where("project.id = :id", { id: project });
        }

        if (q) {
            query.where("ep.name LIKE :name", { name: `%${q}%` })
                .orWhere("ep.modality LIKE :modality", { modality: `%${q}%` });
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Event>(await query.getMany(), page, rpp);
    }

}
