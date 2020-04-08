import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./GenericRepository";
import { User, UserCredentials } from "../entities";

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

    /**
     * Find user by credentials.
     * @param name      -- user name inserted on login form.
     * @param password  -- user password inserted on login form.
     */
    public async findByCredentials(credentials: UserCredentials): Promise<User | undefined> {
        return this.findOne({ email: credentials.email, password: credentials.password });
    }

}
