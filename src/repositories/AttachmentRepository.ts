import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Attachment, Project, Publication, Activity } from "../entities";
import { IOptions } from "../core/types";
import { StringUtils } from "../core/utils";
import { NotFound } from "@tsed/exceptions";

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
    public async findInfo(id?: number): Promise<Attachment | undefined> {
        return this.createQueryBuilder("att")
            .leftJoinAndSelect("att.projects", "p")
            .leftJoinAndSelect("att.publications", "pb")
            .leftJoinAndSelect("att.activities", "act")
            .where("att.id = :id", { id })
            .getOne();
    }

    /**
     * Delete a attachment and its relationships.
     * @param id                            -- attachment id.
     */
    public async erase(id?: number): Promise<any> {
        const attachment = await this.findInfo(id);
        if (!attachment) {
            throw new NotFound("Attachment not found.");
        }

        if (attachment.projects) {
            for (const p of attachment.projects) {
                await this.createQueryBuilder("attachment").relation("projects").of(attachment).remove(p);
            }
        }

        if (attachment.publications) {
            for (const p of attachment.publications) {
                await this.createQueryBuilder("attachment").relation("publications").of(attachment).remove(p);
            }
        }

        if (attachment.activities) {
            for (const p of attachment.activities) {
                await this.createQueryBuilder("attachment").relation("activities").of(attachment).remove(p);
            }
        }

        return this.deleteById(attachment.id);
    }

    public async linkProject(attachmentId: number, projectId: number): Promise<void> {
        const attachment = await this.createQueryBuilder("attachment")
            .innerJoin("attachment.projects", "project", "project.id = :projectId", { projectId })
            .where("attachment.id = :attachmentId", { attachmentId })
            .getOne();
        if (!attachment) {
            await this.createQueryBuilder("attachment").relation("projects").of({ id: attachmentId }).add({ id: projectId });
        }
    }

    public async linkActivity(attachmentId: number, activityId: number): Promise<void> {
        const attachment = await this.createQueryBuilder("attachment")
            .innerJoin("attachment.activities", "activity", "activity.id = :activityId", { activityId })
            .where("attachment.id = :attachmentId", { attachmentId })
            .getOne();
        if (!attachment) {
            await this.createQueryBuilder("attachment").relation("activities").of({ id: attachmentId }).add({ id: activityId });
        }
    }

    public async linkPublication(attachmentId: number, publicationId: number): Promise<void> {
        const attachment = await this.createQueryBuilder("attachment")
            .innerJoin("attachment.publications", "publication", "publication.id = :publicationId", { publicationId })
            .where("attachment.id = :attachmentId", { attachmentId })
            .getOne();
        if (!attachment) {
            await this.createQueryBuilder("attachment").relation("publications").of({ id: attachmentId }).add({ id: publicationId });
        }
    }

}
