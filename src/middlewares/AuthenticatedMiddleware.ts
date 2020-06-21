import { EndpointInfo, IMiddleware, Middleware, Next, Req, Res } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";

import { AuthenticationService } from "../core/services";
import { IAuthenticatedOptions, IJwt } from "../core/types";

@Middleware()
export class AuthenticatedMiddleware implements IMiddleware {

    constructor(private authenticationService: AuthenticationService) {}

    /**
     * Retrieve token from headers and check request authorization.
     * @param request   -- express request object.
     * @param endpoint  -- express endpoint.
     */
    public async use(
        @Req() request: Req,
        @Res() response: Res,
        @Next() next: Next,
        @EndpointInfo() endpoint: EndpointInfo
    ): Promise<void> {
        // retrieve options given to the @UseAuth decorator
        const options: IAuthenticatedOptions = endpoint.get(AuthenticatedMiddleware) || {};

        // retrieve token from request headers
        const token: string | undefined = request.header("Authorization");
        if (!token) {
            throw new Unauthorized("Missing token!");
        }

        const decodedJwt: IJwt = await this.authenticationService.verifyJwtToken(token)
            .catch((err: any) => {
                throw new Unauthorized(err.message || err);
            });
        
        // shared user information by response locals
        const context = await this.authenticationService.context(decodedJwt);
        
        // user scope must match defined options, if options exists.
        // if options do not exists, just a valid token is required.
        if ((options.role && options.role !== context.scope.key) ||
            (options.scope && !options.scope.includes(context.scope.key))) {
            throw new Forbidden("You are not allowed here.");
        }

        response.locals.context = await this.authenticationService.context(decodedJwt);
        response.locals.token = token;

        // go the next middleware/endpoint
        next();
    }

}
