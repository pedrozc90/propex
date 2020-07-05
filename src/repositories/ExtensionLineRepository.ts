import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ExtensionLine, Project } from "../entities";
import { StringUtils } from "../core/utils";
import { IOptions } from "../core/types";

interface ExtensionLineOptions extends IOptions {
    id?: number;
    project?: Project;
    projectId?: number;
    name?: string;
    operation?: string;
}

@EntityRepository(ExtensionLine)
export class ExtensionLineRepository extends GenericRepository<ExtensionLine> {

    constructor() {
        super([ "project" ]);
    }

    /**
     * Return a list of extension lines.
     * @param options                       -- options
     */
    public async fetch(params: ExtensionLineOptions): Promise<ExtensionLine[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("el");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("el.projects", "p", "p.id = :projectId", { projectId });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.where("el.name LIKE :name", { name: `%${params.q}%` })
                .orWhere("el.operation LIKE :operation", { operation: `%${params.q}%` });
        }

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }
        
        return query.getMany();
    }

    public async findByProject(id: number, projectId: number): Promise<ExtensionLine | undefined> {
        return this.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId })
            .where("el.id = :id", { id })
            .getOne();
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
