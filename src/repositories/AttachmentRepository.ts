import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Attachment } from "../entities";

@EntityRepository(Attachment)
export class AttachmentRepository extends GenericRepository<Attachment> {

}
