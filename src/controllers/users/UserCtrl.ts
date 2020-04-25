import { Controller, Get, QueryParams } from "@tsed/common";

import { UserRepository } from "../../repositories";
import { User, Page } from "../../entities";
import { IOptions } from "../../types";

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
    // @ReturnsArray(User)
    // @CustomAuth({ scope: [ Role.MASTER ] })
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number,
        @QueryParams("q") q: string): Promise<Page<User>> {
        const options: IOptions = {};
        options.page = page || 1;
        options.rpp = rpp || 0;
        options.q = q || undefined;

        return this.userRepository.fetch({ ...options });
    }
    
}
