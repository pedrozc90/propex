import { EntityRepository } from "@tsed/typeorm";
import { Like } from "typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ExtensionLine, Page } from "../entities";
import { StringUtils } from "../core/utils";

@EntityRepository(ExtensionLine)
export class ExtensionLineRepository extends GenericRepository<ExtensionLine> {

    constructor() {
        super([ "project" ]);
    }

    public async fetch(page: number = 1, rpp: number = 15, q?: string, projectId?: number): Promise<Page<ExtensionLine>> {
        const params: any = {
            skip: (page - 1) * rpp,
            take: rpp
        };

        if (StringUtils.isNotEmpty(q)) {
            params.where = [
                { name: Like(`%${q}%`) },
                { operation: Like(`%${q}%`) }
            ];
        };
        if (projectId) {
            params.where.project = { id: projectId };
            params.join = {
                alias: "el",
                innerJoin: { projects: "el.projects" }
            };
        }
        return Page.of(await this.find(params), page, rpp);
    }

    /**
     * Return the last number of extension lines.
     */
    public async lastNumber(): Promise<number> {
        const { max } = await this.createQueryBuilder("el")
            .select("MAX(el.number)", "max")
            .getRawOne();
        return max || 0;
    }

}
