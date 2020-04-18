import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { DisclosureMedia, Project } from "../entities";

@EntityRepository(DisclosureMedia)
export class DisclosureMediaRepository extends GenericRepository<DisclosureMedia> {
    
    public async init(project: Project): Promise<any> {
        const dm1 = new DisclosureMedia();
        dm1.name = "Media A";
        dm1.link = "http://www.domain.com/media/1";
        dm1.date = "2020-01-10";
        dm1.project = project;

        const dm2 = new DisclosureMedia();
        dm2.name = "Media B";
        dm2.link = "http://www.domain.com/media/2";
        dm2.date = "2020-02-24";
        dm2.project = project;

        return this.save([ dm1, dm2 ]);
    }

}
