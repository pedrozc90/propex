import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Event } from "../entities";

@EntityRepository(Event)
export class EventRepository extends GenericRepository<Event> {

}
