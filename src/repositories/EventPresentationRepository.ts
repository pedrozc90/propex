import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { EventPresentation } from "../entities";

@EntityRepository(EventPresentation)
export class EventPresentationRepository extends GenericRepository<EventPresentation> {

}
