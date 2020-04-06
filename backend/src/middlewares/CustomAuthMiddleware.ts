import { EndpointInfo, IMiddleware, Middleware, Next, Req, Res } from "@tsed/common";
import { Forbidden, Unauthorized } from "ts-httpexceptions";

import { User } from "../models/User";
import { ICustomAuthOptions, IJwt } from "../types/types";
import { AuthenticationService } from "../services/authentication/AuthenticationService";

@Middleware()
export class CustomAuthMiddleware implements IMiddleware {

    constructor(private authenticationService: AuthenticationService) {}

    /**
     * Retrieve token from headers and check request authorization.
     * @param request   -- express request object.
     * @param endpoint  -- express endpoint.
     */
    public async use(@Req() request: Req, @Res() response: Res, @Next() next: Next,
        @EndpointInfo() endpoint: EndpointInfo): Promise<void> {
        // retrieve options given to the @UseAuth decorator
        const options: ICustomAuthOptions = endpoint.get(CustomAuthMiddleware) || {};

        // retrieve token from request headers
        const token: string | undefined = request.header("Authorization");
        if (!token) {
            throw new Unauthorized("Missing token!");
        }

        // verify and decode jwt token
        await this.authenticationService.verifyJwtToken(token).then((decodeJwt: IJwt) => {
            if (decodeJwt) {
                // update thread local
                // this.authenticationService.setContext(token, decodeJwt);

                // shared user information by response locals
                response.locals.user = new User();

                // check if endpoint requires a role permission.
                if (options.scope && !options.scope.includes(decodeJwt.role)) {
                    throw new Forbidden("Forbidden");
                }
            } else {
                throw new Unauthorized("Unauthorized, Invalid Token!");
            }
        }).catch((err: any) => {
            throw new Unauthorized(err.message || err);
        });

        // go the next middleware
        next();
    }

}
