import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Attachment, Project, Publication, Activity } from "../entities";
import { IOptions } from "../core/types";
import { StringUtils } from "../core/utils";

interface AttachmentOptions extends IOptions {
    id?: number;
    url?: string;
    contentType?: string;
    size?: number;
    filename?: string;
    filenameNormalized?: string;
    extension?: string;
    // content?: Buffer;
    publication?: Publication;
    publicationId?: number;
    activity?: Activity;
    activityId?: number;
    project?: Project;
    projectId?: number;
}

@EntityRepository(Attachment)
export class AttachmentRepository extends GenericRepository<Attachment> {

    /**
     * Return a list of attachments.
     * @param options                       -- options
     */
    public async fetch(params: AttachmentOptions): Promise<Attachment[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("att");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("att.projects", "p", "p.id = :projectId", { projectId });
        }

        if (params.publication || params.publicationId) {
            const publicationId = params.publicationId || params.publication?.id;
            query.innerJoin("att.publications", "pb", "pb.id = :publicationId", { publicationId });
        }

        if (params.activity || params.activityId) {
            const activityId = params.activityId || params.activity?.id;
            query.innerJoin("att.activities", "act", "act.id = :activityId", { activityId });
        }
        
        if (StringUtils.isNotEmpty(params.q)) {
            query.where("att.filename LIKE :filename", { filename: `%${params.q}%` })
                .orWhere("att.filename_normalized LIKE :filenameNormalized", { filenameNormalized: `%${params.q}%` })
                .orWhere("att.extension LIKE :extension", { extension: `%${params.q}%` });
        }

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }
        
        return query.getMany();
    }

    /**
     * Return a list of attachments.
     * @param options                       -- options
     */
    public async findInfo(id: number): Promise<Attachment | undefined> {
        return this.createQueryBuilder("att")
            .leftJoin("att.projects", "p")
            .leftJoin("att.publications", "pb")
            .leftJoin("att.activities", "act")
            .where("att.id = :id", { id })
            .getOne();
    }

}
