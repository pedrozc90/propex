import { EntityRepository } from "@tsed/typeorm";
import { Like } from "typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { KnowledgeArea, Project, Page } from "../entities";
import { IOptions } from "../types";

@EntityRepository(KnowledgeArea)
export class KnowledgeAreaRepository extends GenericRepository<KnowledgeArea> {

    /**
     * Return a paged list of all kowndledge areas saved in the database.
     * @param options                       -- query options.
     */
    public async fetch(options: IOptions): Promise<Page<KnowledgeArea>> {
        const params: any = {};
        if (options.page && options.rpp) {
            params.skip = (options.page - 1) * options.rpp;
            params.take = options.rpp;
        }
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) }
            ];
        };
        return Page.of(await this.find(params), options.page, options.rpp);
    }

    /**
     * Return a list of all knowledge areas saved in the database.
     * @param options                       -- query options
     */
    public async list(options: any): Promise<KnowledgeArea[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }

    /**
     * Overwrite project knowledge areas, delete the items not send, and add the new items.
     * @param project                       -- project to overwrite its knowdledge areas.
     * @param knowledgeAreas                -- list of knwoledge areas (they must exists in the database).
     */
    public async overwrite(project: Project, knowledgeAreas: KnowledgeArea[]): Promise<KnowledgeArea[]> {
        // load extension lines which the project has connection.
        const savedKnowledgeAreas = await this.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId: project.id })
            .getMany();
        
        // find kownledge areas the to deleted (elements that are saved on database but not in the received array)
        const knowledgeAreasToDelete = savedKnowledgeAreas.filter((a) => knowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (knowledgeAreasToDelete && knowledgeAreasToDelete.length > 0) {
            await this.createQueryBuilder("knowledgeAreas").relation("projects").of(knowledgeAreasToDelete).remove(project);
        }

        // find kownledge areas the to saved (elements that are not saved on database)
        const knowledgeAreasToInsert = knowledgeAreas.filter((a) => !!a.id && savedKnowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (knowledgeAreasToInsert && knowledgeAreasToInsert.length > 0) {
            await this.createQueryBuilder("knowledgeAreas").relation("projects").of(knowledgeAreasToInsert).add(project);
        }

        return this.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId: project.id })
            .getMany();
    }
    
}
