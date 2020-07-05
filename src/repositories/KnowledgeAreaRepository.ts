import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { KnowledgeArea, Project } from "../entities";

import { StringUtils } from "../core/utils";
import { IOptions } from "../core/types";

interface KnowledgeAreaOptions extends IOptions {
    id?: number;
    project?: Project;
    projectId?: number;
    name?: string;
}

@EntityRepository(KnowledgeArea)
export class KnowledgeAreaRepository extends GenericRepository<KnowledgeArea> {

    constructor() {
        super([ "projects" ]);
    }

    /**
     * Return a paged list of all kowndledge areas saved in the database.
     * @param options                       -- query options.
     */
    public async fetch(params: KnowledgeAreaOptions): Promise<KnowledgeArea[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("ka");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("ka.projects", "p", "p.id = :projectId", { projectId });
        }

        if (StringUtils.isNotEmpty(params.name)) {
            query.andWhere("ka.name = :name", { name: params.name });
        };
        
        if (StringUtils.isNotEmpty(params.q)) {
            query.andWhere("ka.name LIKE :name", { name: `%${params.q}%` });
        };

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return query.getMany();
    }

    public async findByProject(id: number, projectId: number): Promise<KnowledgeArea | undefined> {
        return this.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId })
            .where("ka.id = :id", { id })
            .getOne();
    }

    /**
     * Overwrite project knowledge areas, delete the items not send, and add the new items.
     * @param project                       -- project to overwrite its knowdledge areas.
     * @param knowledgeAreas                -- list of knwoledge areas (they must exists in the database).
     */
    public async overwrite(project: Project, knowledgeAreas: KnowledgeArea[]): Promise<KnowledgeArea[]> {
        // load extension lines which the project has connection.
        const savedKnowledgeAreas = await this.fetch({ projectId: project.id });
        
        // find kownledge areas the to deleted (elements that are saved on database but not in the received array)
        const knowledgeAreasToDelete = savedKnowledgeAreas.filter((a) => knowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (knowledgeAreasToDelete.length > 0) {
            await this.createQueryBuilder("knowledgeAreas").relation("projects").of(knowledgeAreasToDelete).remove(project);
        }

        // find kownledge areas the to saved (elements that are not saved on database)
        const knowledgeAreasToInsert = knowledgeAreas.filter((a) => !!a.id && savedKnowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (knowledgeAreasToInsert.length > 0) {
            await this.createQueryBuilder("knowledgeAreas").relation("projects").of(knowledgeAreasToInsert).add(project);
        }

        return this.fetch({ projectId: project.id });
    }
    
}
