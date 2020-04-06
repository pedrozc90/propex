import { EntityRepository } from "@tsed/typeorm";

import { User } from "../models/User";
import { GenericRepository } from "./GenericRepository";

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

    /**
     * Find user by credentials.
     * @param name      -- user name inserted on login form.
     * @param password  -- user password inserted on login form.
     */
    public async findByCredentials(name: string, password: string): Promise<User | undefined> {
        return this.findOne({ name, password });
    }

}
