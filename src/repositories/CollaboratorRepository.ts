import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Collaborator, User } from "../entities";

@EntityRepository(Collaborator)
export class CollaboratorRepository extends GenericRepository<Collaborator> {
    
    public async init(user: User): Promise<any> {
        const c1 = new Collaborator();
        c1.academicFunction = "General";
        c1.affiliation = "CLT";
        c1.profissionalRegistry = "Medic";
        c1.user = user;

        const c2 = new Collaborator();
        c2.academicFunction = "Commander";
        c2.affiliation = "Prestação de Serviços";
        c2.profissionalRegistry = "Soldier";
        c2.user = user;

        return this.save([ c1, c2 ]);
    }

}
