import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
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

    /**
     * Generate a random password.
     */
    public generateRandomPassword(length: number = 8): string {
        const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength: number = characters.length;
        const selected: string[] = [];
        for (let i = 0; i < length; i++) {
            selected[i] = characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return selected.join("");
    }

}
