import { $log, BodyParams, Controller, Get, Post, Required, Res } from "@tsed/common";
import { InternalServerError, Unauthorized } from "ts-httpexceptions";

import { AuthenticationService, CustomAuth } from "../../services";
import { User, UserBasic, UserCredentials } from "../../entities";
import { IToken } from "../../types";

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

        if (!user.active) {
            throw new Unauthorized("User is not active. Please, contact the administrator.");
        }

        // sign jwt token
        const token = await this.authenticationService.signJwtToken(user, credentials.rememberMe);
        if (!token) {
            throw new Unauthorized("Unable to create token!");
        }

        $log.warn(`[Authentication] user: ${user.email}, token: ${token}`);
        // update context information
        // await this.authenticationService.setContext(token, { role: user.role, _id: user._id } as IJwt);

        return { token };
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

}
