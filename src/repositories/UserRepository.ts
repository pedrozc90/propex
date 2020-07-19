import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { User, UserCredentials, Project } from "../entities";
import { IOptions, Scope } from "../core/types";

import { StringUtils } from "../core/utils";
import { BadRequest } from "@tsed/exceptions";
import { $log } from "@tsed/common";

interface UserOptions extends IOptions {
    id?: number;
    email?: string;
    password?: string;
    active?: boolean;
    code?: string;
    affiliation?: string;
    role?: Scope;
    period?: string;
    project?: Project;
    projectId?: number;
}

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

    public async fetch(params: UserOptions): Promise<User[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("usr");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("usr.projectHumanResources", "phr", "phr.project_id = :projectId", { projectId });
        }

        if (params.role) {
            query.andWhere("usr.role = :role", { role: params.role.key });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.andWhere("(usr.email LIKE :email OR usr.name LIKE :name OR usr.code LIKE :code)", { email: `%${params.q}%`, name: `%${params.q}%`, code: `%${params.q}%` });
        }
        
        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return query.getMany();
    }

    /**
     * Find user by credentials.
     * @param name                          -- user name inserted on login form.
     * @param password                      -- user password inserted on login form.
     */
    public async findByCredentials(credentials: UserCredentials): Promise<User | undefined> {
        return this.findOne({ email: credentials.email, password: credentials.password });
    }

    /**
     * Select user data with collaborator or student info.
     * @param options                       -- query options.
     */
    public async findUserInfo(params: UserOptions): Promise<User | undefined> {
        const query = this.createQueryBuilder("usr");

        if (params.id) {
            query.where("usr.id = :id", { id: params.id });
        }

        if (StringUtils.isNotEmpty(params.email)) {
            query.andWhere("usr.email = :email", { email: params.email });
        }

        if (isBoolean(params.active)) {
            query.andWhere("usr.active = :active", { active: (params.active) ? 1 : 0 });
        }

        if (StringUtils.isNotEmpty(params.code)) {
            query.andWhere("usr.code = :code", { code: params.code });
        }
            
        return query.getOne();
    }

    public async register(data: User): Promise<User> {
        let user = await this.findUserInfo({ email: data.email, code: data.code });
        if (user) {
            throw new BadRequest(`Email ${user.email} already in use.`);
        }

        // generate a random password for a new user.
        if (!data.password) {
            data.password = this.generateRandomPassword();
        }

        // save new user.
        user = this.create(data);
        
        // save collaborator or student data.
        if (user.role === Scope.COLLABORATOR) {
            user.scholarship = false;
            user.period = null;
        } else if (user.role === Scope.STUDENT) {
            user.academicFunction = null;
            user.affiliation = null;
        }

        user = await this.save(user);

        // send email to user to informe the new password
        $log.warn("--------------------------------------------------");
        $log.warn("SEND EMAIL WITH PASSWORD TO THE NEW USER.");
        $log.warn("--------------------------------------------------");

        return user;
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
