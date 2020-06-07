import { EntityRepository } from "@tsed/typeorm";
import { Exception } from "@tsed/exceptions";

import { GenericRepository } from "./generics/GenericRepository";
import { User, UserCredentials } from "../entities";

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

    /**
     * Find user by credentials.
     * @param name                          -- user name inserted on login form.
     * @param password                      -- user password inserted on login form.
     */
    public async findByCredentials(credentials: UserCredentials): Promise<User | undefined> {
        return this.findOne({ email: credentials.email, password: credentials.password });
    }

    /**
     * Find user by id or email.
     * @param options                       -- query options.
     */
    public async findByIdOrEmail(options: { id?: number, email?: string }): Promise<User | undefined> {
        return this.findOne({
            where: [
                { id: options.id },
                { email: options.email }
            ]
        });
    }

    /**
     * Select user data with collaborator or student info.
     * @param options                       -- query options.
     */
    public async findUserInfo(options: { id?: number, email?: string }): Promise<User | undefined> {
        return this.findOne({
            where: {
                id: options.id,
                email: options.email
            },
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    collaborator: "user.collaborator",
                    student: "user.student"
                }
            }
        });
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
