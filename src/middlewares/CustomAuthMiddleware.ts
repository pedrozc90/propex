import { EndpointInfo, IMiddleware, Middleware, Next, Req, Res } from "@tsed/common";
import { Forbidden, Unauthorized } from "ts-httpexceptions";

import { AuthenticationService } from "../services";
import { ICustomAuthOptions, IJwt, Scope } from "../types";

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
        await this.authenticationService.verifyJwtToken(token).then(async (decodeJwt: IJwt) => {
            if (decodeJwt) {
                // shared user information by response locals
                response.locals.context = await this.authenticationService.context(decodeJwt.id || 0);

                // check if endpoint requires a role permission.
                // if (options.role && (Scope as any)[options.role] !== response.locals.context.scope) {
                //     throw new Forbidden("You are not allowed here.");
                // }

                // if (options.scope && !options.scope.includes(response.locals.context.scope)) {
                //     throw new Forbidden("You are not allowed here.");
                // }
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
