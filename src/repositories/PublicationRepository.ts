import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Publication, Project, Attachment } from "../entities";
import { IOptions, PublicationType } from "../core/types";
import { StringUtils } from "../core/utils";

interface PublicationOptions extends IOptions {
    id?: number;
    project?: Project;
    projectId?: number;
    type?: PublicationType;
    title?: string;
    journalName?: string;
    link?: string;
    attachment?: Attachment;
    attachmentId?: number;
}

@EntityRepository(Publication)
export class PublicationRepository extends GenericRepository<Publication> {
    
    /**
     * Return a list of activities.
     * @param options                       -- options
     */
    public async fetch(params: PublicationOptions): Promise<Publication[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("pb")
            .leftJoinAndSelect("pb.attachment", "att");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("pb.project", "p", "p.id = :projectId", { projectId });
        }
        
        if (StringUtils.isNotEmpty(params.q)) {
            query.where("pb.title LIKE :title", { title: `%${params.q}%` })
                .orWhere("pb.journalName LIKE :journalName", { journalName: `%${params.q}%` });
        }

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }
        
        return await query.getMany();
    }

}
