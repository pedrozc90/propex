import { $log, BodyParams, Controller, Delete, Get, PathParams, Put, QueryParams, Required } from "@tsed/common";
import { Returns, ReturnsArray } from "@tsed/swagger";
import { HTTPException, Unauthorized } from "ts-httpexceptions";

import { CustomAuth } from "../../services/authentication/CustomAuth";
import { User } from "../../models/User";
import { Page } from "../../models/generics/Page";
import { UserRepository } from "../../repositories/UserRepository";
import { Role } from "../../types/enums";
import { IOptions } from "../../types/types";

@Controller("/users")
export class UserCtrl {

    constructor(private userRepository: UserRepository) {}

    /**
     * Fetch a list of documents using pagination.
     * @param page  -- page number
     * @param rpp   -- number of elements a page contains
     * @param q     -- extra query param, used for searching
     */
    @Get("/")
    @ReturnsArray(User)
    @CustomAuth({ scope: [ Role.MASTER ] })
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number,
        @QueryParams("q") q: string): Promise<Page<User> | User[]> {
        const options: IOptions = {};
        options.page = page || 1;
        options.rpp = rpp || 0;
        options.q = q || undefined;

        return this.userRepository.fetch({ ...options });
    }

    /**
     * Update user information.
     * @param user  -- user instance
     */
    @Put("/")
    public async update(@Required() @BodyParams("user") user: User): Promise<User | null> {
        $log.warn(user);
        // return this.userRepository.save(user);
        return null;
    }

    /**
     * Endpoint to alter user password.
     * @param username          -- username provided
     * @param password          -- password provided
     * @param newPassword      -- new password
     * @param confirmPassword  -- confirm password, needs to match the new password and difference from password
     */
    @Put("/change_password")
    @Returns(User)
    public async changePassword(
        @Required() @BodyParams("username") username: string,
        @Required() @BodyParams("password") password: string,
        @Required() @BodyParams("new_password") newPassword: string,
        @Required() @BodyParams("confirm_password") confirmPassword: string): Promise<any> {
        $log.warn(username, password, newPassword, confirmPassword);

        if (newPassword !== confirmPassword) {
            throw new HTTPException(200, "Invalid Password, new password do not match confirm password.");
        }

        // if (newPassword === password) {
        //     throw new HTTPException(200, "Invalid Password.");
        // }

        return this.userRepository.findByCredentials(username, password).then((res?: User) => {
            if (res) {
                res.password = newPassword;
                return this.userRepository.save(res);
            }
        }).catch((err: any) => {
            throw new Unauthorized("Unauthorized", err);
        });
    }

    /**
     * Fetch a single user by _id.
     * @param _id   -- user _id
     */
    @Get("/:id")
    public async findById(@Required() @PathParams("id") id: number): Promise<User | undefined> {
        return this.userRepository.findById(id);
    }

    /**
     * Delete a single user.
     * @param _id -- user _id
     */
    @Delete("/:id")
    public async remove(@Required() @PathParams("id") id: number): Promise<any> {
        return this.userRepository.delete(id);
    }

}
