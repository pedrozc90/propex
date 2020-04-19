import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectAttachment } from "../entities";

@EntityRepository(ProjectAttachment)
export class ProjectAttachmentRepository extends GenericRepository<ProjectAttachment> {
    
    public async init(): Promise<any> {
        return null;
    }

}
