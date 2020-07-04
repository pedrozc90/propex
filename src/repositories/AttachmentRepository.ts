import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Attachment, Project, Publication, Activity } from "../entities";
import { IOptions } from "src/core/types";
import { StringUtils } from "src/core/utils";

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
     * Return a list of activities.
     * @param options                       -- options
     */
    public async fetch(params: AttachmentOptions): Promise<Attachment[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("att");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("att.project", "p", "p.id = :projectId", { projectId });
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
        
        return await query.getMany();
    }

}
