import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./GenericRepository";
import { Permission } from "../entities";

@EntityRepository(Permission)
export class PermissionRepository extends GenericRepository<Permission> {
    
}
