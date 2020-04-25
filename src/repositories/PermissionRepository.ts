import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Permission } from "../entities";

@EntityRepository(Permission)
export class PermissionRepository extends GenericRepository<Permission> {
    
    public async init(): Promise<any> {
        const a = new Permission();
        a.name = "Permission A";
        a.url = "/permission_a";

        const b = new Permission();
        b.name = "Permission B";
        b.url = "/permission_b";

        return this.save([ a, b ]);
    }
    
}
