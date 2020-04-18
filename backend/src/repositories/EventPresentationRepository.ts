import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { EventPresentation, Project } from "../entities";

@EntityRepository(EventPresentation)
export class EventPresentationRepository extends GenericRepository<EventPresentation> {
    
    public async init(project: Project): Promise<any> {
        const ep1 = new EventPresentation();
        ep1.name = "Event A";
        ep1.modality = "A";
        ep1.date = "2020-9-29";
        ep1.project = project;

        const ep2 = new EventPresentation();
        ep2.name = "Event B";
        ep2.modality = "B";
        ep2.date = "2020-11-24";
        ep2.project = project;

        return this.save([ ep1, ep2 ]);
    }

}
