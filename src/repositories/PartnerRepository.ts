import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Partner, Project, Page } from "../entities";
import { IOptions } from "src/types";

@EntityRepository(Partner)
export class PartnerRepository extends GenericRepository<Partner> {

    public async fetch(options: IOptions): Promise<Page<Partner>> {
        const page = options.page || 1;
        const rpp = options.rpp || 15;
        const q = options.q;
        const project = options.project;

        const query = this.createQueryBuilder("partner");

        if (project) {
            if (typeof project === "string") {
                query.innerJoin("partner.project", "project", "project.title LIKE :title", { title: `%${project}%` });
            } else if (typeof project === "number") {
                query.innerJoin("partner.project", "project", "project.id LIKE :projectId", { projectId: project });
            }
        }

        if (q) {
            query.where("partner.name LIKE :name", { name: `%${q}%` })
                .orWhere("partner.email LIKE :email", { email: `%${q}%` })
                .orWhere("partner.phone LIKE :phone", { phone: `%${q}%` });
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Partner>(await query.getMany(), page, rpp);
    }
    
    public async findMatch(partner: Partner, project?: Project): Promise<Partner | undefined> {
        return this.findOne({
            where: [
                { id: partner.id },
                { email: partner.email },
                { project: { id: project?.id } }
            ],
            join: {
                alias: "demand",
                innerJoin: { project: "demand.project" }
            }
        });
    }

}
