import { $log, BodyParams, Controller, Get, Post, Required, Res } from "@tsed/common";
import { InternalServerError, Unauthorized } from "ts-httpexceptions";

import { AuthenticationService } from "../../services/authentication/AuthenticationService";
import { CustomAuth } from "../../services/authentication/CustomAuth";

import { User, UserBasic, UserCredentials } from "../../entities/User";
import { IToken } from "../../types/types";
import { Role } from "../../types/enums";

@Controller("/auth")
export class AuthenticationCtrl {

    constructor(private authenticationService: AuthenticationService) {}

    /**
     * Login user by creating  a jwt token.
     * @param username      -- username from login form.
     * @param password      -- password from login form.
     */
    @Post("/login")
    public async login(@Required() @BodyParams("credentials") credentials: UserCredentials): Promise<IToken> {
        // retrive user information
        const user = await this.authenticationService.findByCredentials(credentials);
        if (!user) {
            throw new Unauthorized("Invalid username or password!");
        }

        // sign jwt token
        const token = await this.authenticationService.signJwtToken(user);
        if (!token) {
            throw new Unauthorized("Unable to create token!");
        }

        $log.warn("token:", token);
        // update context information
        // await this.authenticationService.setContext(token, { role: user.role, _id: user._id } as IJwt);

        return { token, role: user.role };
    }

    /**
     * Logout and redirect back to login page.
     * @param req       -- express request object.
     * @param res       -- express response object.
     * @param next      -- express next function.
     */
    @Get("/logout")
    public async logout(@Res() res: Res): Promise<void> {
        res.redirect("/api/auth/login");
    }

    /**
     * Create a new user.
     * @param user      -- user instance
     */
    @Post("/register")
    public async register(@Required() @BodyParams("user") user: UserBasic): Promise<User | null> {
        const tmp = await this.authenticationService.register(user);
        if (!tmp) {
            throw new InternalServerError("Sorry, but a error occured during registration.");
        }
        return tmp;
    }

    /**
     * Fetch user context information.
     * @param req       -- express request object.
     */
    @Get("/context")
    @CustomAuth({ scope: [ Role.MEMBER, Role.MASTER ] })
    public async context(@Res() response: Res): Promise<any> {
        return { message: "Sanity Check", context: response.locals.user };
    }

}
