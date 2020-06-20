import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Evaluation, Page } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

@EntityRepository(Evaluation)
export class EvaluationRepository extends GenericRepository<Evaluation> {

    public async fetch(options: IOptions): Promise<Page<Evaluation>> {
        const page = options.page || 1;
        const rpp = options.rpp || 15;
        const q = options.q;
        const project = options.project;

        const query = this.createQueryBuilder("ev")
            .innerJoin("ev.project", "project");

        if (StringUtils.isNotEmpty(q)) {
            query.where(`ev.description LIKE '%${q}%'`);
        }

        if (project) {
            if (typeof project === "string") {
                query.where("project.title LIKE :title", { title: `%${project}%` });
            } else if (typeof project === "number") {
                query.where("project.id = : id", { id: project });
            }
        }

        return Page.of<Evaluation>(await query.getMany(), page, rpp);
    }

}
