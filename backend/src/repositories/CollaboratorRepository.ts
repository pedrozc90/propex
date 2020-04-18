import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Collaborator, User } from "../entities";

@EntityRepository(Collaborator)
export class CollaboratorRepository extends GenericRepository<Collaborator> {
    
    public async init(user: User): Promise<any> {
        const c1 = new Collaborator();
        c1.academicFunction = "collaborator A";
        c1.linkFormat = "collaborator A";
        c1.profissionalRegistry = "medic";
        c1.user = user;

        const c2 = new Collaborator();
        c2.academicFunction = "collaborator B";
        c2.linkFormat = "collaborator B";
        c2.profissionalRegistry = "soldier";
        c2.user = user;

        return this.save([ c1, c2 ]);
    }

}
