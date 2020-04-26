import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { User, UserCredentials } from "../entities";

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

    public async init(): Promise<any> {
        const usr = new User();
        usr.name = "admin";
        usr.email = "admin@domain.com";
        usr.password = "admin";
        usr.phone = "(48) 99999-9999";

        const usr2 = new User();
        usr2.name = "dev";
        usr2.email = "dev@domain.com";
        usr2.password = "dev";
        usr2.phone = "(48) 99999-9999";

        return this.save([ usr, usr2 ]);
    }

    /**
     * Find user by credentials.
     * @param name      -- user name inserted on login form.
     * @param password  -- user password inserted on login form.
     */
    public async findByCredentials(credentials: UserCredentials): Promise<User | undefined> {
        return this.findOne({ email: credentials.email, password: credentials.password });
    }

}
