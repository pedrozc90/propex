import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { User, UserCredentials, Project } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

interface UserOptions extends IOptions {
    id?: number;
    email?: string;
    password?: string;
    active?: boolean;
    code?: string;
    registry?: string;
    project?: Project;
    projectId?: number;
}

@EntityRepository(User)
export class UserRepository extends GenericRepository<User> {

    public async fetch(params: UserOptions): Promise<User[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("usr")
            .leftJoinAndSelect("usr.student", "std")
            .leftJoinAndSelect("usr.collaborator", "clb");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("usr.projectHumanResources", "phr", "phr.project_id = :projectId", { projectId });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.where("usr.email LIKE :email", { email: `%${params.q}%` })
                .orWhere("usr.name LIKE :name", { name: `%${params.q}%` });
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
        // return this.findOne({
        //     where: {
        //         id: options.id,
        //         email: options.email
        //     },
        //     join: {
        //         alias: "user",
        //         leftJoinAndSelect: {
        //             collaborator: "user.collaborator",
        //             student: "user.student"
        //         }
        //     }
        // });
        const query = this.createQueryBuilder("usr")
            .leftJoinAndSelect("usr.collaborator", "clb")
            .leftJoinAndSelect("usr.student", "std");

        if (params.id) {
            query.where("usr.id = :id", { id: params.id });
        }

        if (params.email) {
            query.where("usr.email = :email", { email: params.email });
        }

        if (isBoolean(params.active)) {
            query.where("usr.active = :active", { active: (params.active) ? 1 : 0 });
        }

        if (params.code) {
            query.where("std.code = :code", { code: params.code });
        }

        if (params.registry) {
            query.where("clb.professional_registry = :registry", { registry: params.registry });
        }
            
        return query.getOne();
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
